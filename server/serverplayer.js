const { BasicRangeAttack } = require("./abilities/basic-range-attack.js");
const { BasicMeleeAttack } = require("./abilities/basic-melee-attack.js");
const { BasicShield } = require("./abilities/basic-shield.js");
const {
  players,
  targetable,
  playerGraveyard,
  currentTick,
} = require("./state.js");
const { v4: uuid } = require("uuid");
const { map } = require("./map.js");

class Player {
  constructor(ws) {
    this.ws = ws; // this is used externally to keep track of websockets

    this.id = uuid();
    players[this.id] = this;
    targetable[this.id] = this;

    this.entityX = 100;
    this.entityY = 100;

    //values for determining move direction
    this.pathX = [];
    this.pathY = [];
    this.currentPit = null;
    this.relevantPits = [];
    this.mouseX = 0;
    this.mouseY = 0;

    //values for mouse state
    this.mouseDown = false;
    this.isMoving = false;
    this.lastClickTick = currentTick(); //counts number of frames, used to track moments of a click

    this.lastHitTick = currentTick();
    this.healthRegen = 10 / 60;
    this.maxHealth = 1000;
    this.health = 1000;
    this.shields = {};
    this.shieldOrder = [];
    this.actions = { q: 0, w: 0, e: 0, s: 0 };
    this.actionsUse = { q: 0, w: 0, e: 0, s: 0 };

    this.movespeed = 100 / 60; //X units in 60 ticks; 60ticks = 1 second

    this.abilities = {
      q: new BasicRangeAttack(this.id),
      w: new BasicMeleeAttack(this.id),
      e: new BasicShield(this.id),
    }; //contains upto 3 abilities at members q,w,e
  }

  setInput(input) {
    if (!this.mouseDown && input.mouseDown) {
      // TODO: this is kinda a hack, where what you really want is to store both the previous frame move and the current frame move, that way you don't need to have update logic in the set input logic.
      this.isMoving = true;
      this.lastClickTick = currentTick();
    }

    this.actions = input.actions;
    this.actionsUse.q = input.actionsUse.q ? 1 : this.actionsUse.q;
    this.actionsUse.w = input.actionsUse.w ? 1 : this.actionsUse.w;
    this.actionsUse.e = input.actionsUse.e ? 1 : this.actionsUse.e;

    this.mouseX = input.mouseX;
    this.mouseY = input.mouseY;
    this.mouseDown = input.mouseDown;

    if (input.actions.s) {
      this.isMoving = false;
      this.actionsUse.q = 0;
      this.actionsUse.w = 0;
      this.actionsUse.e = 0;
    }
  }

  getState() {
    return {
      id: this.id,
      entityX: this.entityX,
      entityY: this.entityY,
      maxHealth: this.maxHealth,
      health: this.health,
      shield: this.computeShield(),
      q: this.abilities.q.getState(),
      w: this.abilities.w.getState(),
      e: this.abilities.e.getState(),
    };
  }

  update() {
    if (this.health <= 0) {
      this.reset();
    }

    if (currentTick() - this.lastHitTick > 10 * 60) {
      this.healthRegen = 100 / 60;
    } else {
      this.healthRegen = 5 / 60;
    }

    this.health = Math.min(this.maxHealth, this.health + this.healthRegen);

    if (this.isMoving) {
      if (
        (this.mouseDown && (currentTick() - this.lastClickTick) % 7 == 0) ||
        this.lastClickTick == currentTick()
      ) {
        const desiredX = this.entityX + this.mouseX;
        const desiredY = this.entityY + this.mouseY;

        const path = map.getPath(
          [this.entityX, this.entityY],
          [desiredX, desiredY]
        );
        this.pathX = path.x;
        this.pathY = path.y;
      }

      let availableDistance = this.movespeed;

      while (availableDistance > 0 && this.pathX.length > 0) {
        const deltaX = this.pathX[0] - this.entityX;
        const deltaY = this.pathY[0] - this.entityY;
        const mag = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const moveDistanceX = (deltaX * availableDistance) / mag;
        const moveDistanceY = (deltaY * availableDistance) / mag;

        //if the desired position can be reached in one move
        if (mag <= availableDistance) {
          this.entityX = this.pathX.shift();
          this.entityY = this.pathY.shift();
          availableDistance -= mag;
        } else {
          this.entityX += moveDistanceX;
          this.entityY += moveDistanceY;
          availableDistance = 0;
        }
      }

      if (this.pathX.length == 0) this.isMoving = false;
    }

    //ability update
    ["q", "w", "e"].forEach((key) => {
      if (this.actionsUse[key] && !this.actions.s) {
        this.abilities[key].use();
        this.actionsUse[key] = 0;
      }
    });

    ["q", "w", "e"].forEach((key) => {
      this.abilities[key].update();
    });

    // update current pit
    const pitCheck = map.checkPitOnPoint([this.entityX, this.entityY]);
    if (this.currentPit !== pitCheck) {
      if (this.currentPit) {
        this.currentPit.removePlayer(this);
      }
      if (pitCheck) {
        pitCheck.addPlayer(this);
      }
      this.currentPit = pitCheck;
    }

    this.relevantPits = map.getRelevantPits([this.entityX, this.entityY]);
  }

  sendPlayerTick(players, globalData) {
    const entities = [...globalData];

    for (let index = 0; index < this.relevantPits.length; index++)
      entities.push(...this.relevantPits[index].getEntitiesState());

    const gameState = JSON.stringify({
      type: "tick",
      players,
      entities,
    });

    this.ws.send(gameState);
  }

  reset() {
    this.health = this.maxHealth;
    this.shields = {};
    this.shieldOrder = [];
    this.entityX = 0;
    this.entityY = 0;
  }
  computeShield() {
    let shield = 0;
    Object.entries(this.shields).forEach((entry) => {
      shield += entry[1];
    });
    return shield;
  }

  addShield(amount, id) {
    this.shields[id] = amount;
    this.shieldOrder.push(id);
  }

  removeShield(id) {
    delete this.shields[id];
    this.shieldOrder.splice(this.shieldOrder.indexOf(id), 1);
  }

  hasShield(id) {
    return id in this.shields;
  }

  takeDamage(amount) {
    let initialAmount = amount;

    this.shieldOrder.forEach((id) => {
      //go through each shield
      this.shields[id] -= amount; //remove damage from shield
      if (this.shields[id] <= 0) {
        //damage was greater than shield
        amount = -1 * this.shields[id]; //the new amount should be (amount - shield) but since we used (shield - amount) we negate to convert.
        this.removeShield(id);
      } else {
        amount = 0;
      }
    }); //amount will be the remaining amount of damage after shields

    this.health -= amount;
    if (amount > 0) {
      this.lastHitTick = currentTick();
    }
    return { sheildDamage: initialAmount - amount, healthDamage: amount }; //this needs to be closer to correct
  }

  delete() {
    delete players[this.id];
    delete targetable[this.id];
    if (this.currentPit) this.currentPit.removePlayer(this);
    playerGraveyard[this.id] = this;
  }

  rejoin(ws) {
    players[this.id] = this;
    targetable[this.id] = this;
    if (this.currentPit) this.currentPit.addPlayer(this);
    delete playerGraveyard[this.id];
    this.ws = ws;
  }
}

module.exports = { Player };
