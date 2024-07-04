const { pits } = require("./state.js");

const { BasicRangeAttack } = require("./abilities/basic-range-attack.js");
const { BasicMeleeAttack } = require("./abilities/basic-melee-attack.js");
const { BasicShield } = require("./abilities/basic-shield.js");

class Player {
  constructor(userID, ws) {
    this.id = userID;
    this.ws = ws;
    this.playerX = 0;
    this.playerY = 0;

    //values for determining move direction
    this.pathX = [];
    this.pathY = [];
    this.mouseX = 0;
    this.mouseY = 0;

    //values for mouse state
    this.mouseDown = false;
    this.isMoving = false;
    this.clickBuffer = 0; //counts number of frames, used to track moments of a click

    this.maxHealth = 200;
    this.health = 200;
    this.shields = {};
    this.shieldOrder = [];
    this.actions = { q: 0, w: 0, e: 0, s: 0 };
    this.actionsUse = { q: 0, w: 0, e: 0, s: 0 };

    this.movespeed = 75 / 60; //100 units in 60 ticks; 60ticks = 1 second

    this.abilities = {
      q: new BasicRangeAttack(this.id),
      w: new BasicMeleeAttack(this.id),
      e: new BasicShield(this.id),
    }; //contains upto 3 abilities at members q,w,e
  }

  setInput(input) {
    if (!this.mouseDown && input.mouseDown) {
      this.isMoving = true;
      this.clickBuffer = 0;
    }

    if (input.actions.s) {
      this.isMoving = false;
    }

    this.actions = input.actions;
    this.actionsUse.q = input.actionsUse.q ? 1 : this.actionsUse.q;
    this.actionsUse.w = input.actionsUse.w ? 1 : this.actionsUse.w;
    this.actionsUse.e = input.actionsUse.e ? 1 : this.actionsUse.e;

    this.mouseX = input.mouseX;
    this.mouseY = input.mouseY;
    this.mouseDown = input.mouseDown;
  }

  getState() {
    return {
      id: this.id,
      playerX: this.playerX,
      playerY: this.playerY,
      maxHealth: this.maxHealth,
      health: this.health,
      shield: this.computeShield(),
      q: this.abilities.q.getState(),
      w: this.abilities.w.getState(),
      e: this.abilities.e.getState(),
    };
  }

  computeShield() {
    let shield = 0;
    Object.entries(this.shields).forEach((entry) => {
      shield += entry[1];
    });
    return shield;
  }

  update() {
    if (this.health <= 0) {
      this.reset();
    }

    //movement update
    if (this.isMoving) {
      //set the desired position if the mouse just clicked or several frames have past
      if (this.mouseDown && (this.clickBuffer > 12 || this.clickBuffer == 0)) {
        const desiredX = this.playerX + this.mouseX;
        const desiredY = this.playerY + this.mouseY;

        this.pathX[0] = desiredX;
        this.pathY[0] = desiredY;
        let pitFound = false;
        Object.entries(pits).forEach((entry) => {
          if (!pitFound) {
            const mouseInPit = entry[1].isPointInPit(
              this.playerX,
              this.playerY,
              desiredX,
              desiredY
            );
            console.log(mouseInPit);
            if (mouseInPit) {
              const path = entry[1].getPath(
                this.playerX,
                this.playerY,
                desiredX,
                desiredY
              );

              this.pathX = path.x;
              this.pathY = path.y;
              pitFound = true;
            }
          }
        });
      }
      if (this.pathX.length == 0) {
        this.isMoving = false;
        return;
      }

      const deltaX = this.pathX[0] - this.playerX;
      const deltaY = this.pathY[0] - this.playerY;
      const mag = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const moveDistanceX = (deltaX * this.movespeed) / mag;
      const moveDistanceY = (deltaY * this.movespeed) / mag;

      //if the desired position can be reached in one move
      if (mag <= this.movespeed) {
        this.playerX = this.pathX.shift();
        this.playerY = this.pathY.shift();

        if (this.pathX.length == 0) this.isMoving = false;
      } else {
        this.playerX += moveDistanceX;
        this.playerY += moveDistanceY;
      }

      this.clickBuffer++;
    }

    //ability update
    ["q", "w", "e"].forEach((key) => {
      if (this.actionsUse[key]) {
        this.abilities[key].use();
        this.actionsUse[key] = 0;
      }
    });

    ["q", "w", "e"].forEach((key) => {
      this.abilities[key].update();
    });
  }

  reset() {
    this.health = 200;
    this.maxHealth = 200;
    this.shields = {};
    this.shieldOrder = [];
    this.playerX = 0;
    this.playerY = 0;
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

    console.log("amount after damage", amount);
    this.health -= amount;

    return { sheildDamage: initialAmount - amount, healthDamage: amount }; //this needs to be closer to correct
  }
}

module.exports = { Player };
