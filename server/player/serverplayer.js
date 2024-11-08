const { RangeAttack, MeleeAttack, SelfShield } = require("../abilities/basic.js");
const {
  Health,
  Shield,
  Position,
  Path,
  Radius,
} = require("../entity-components/components.js");

class Player {
  constructor(engine, ws) {
    this.engine = engine;
    this.ws = ws;
    this.entity = this.engine.newEntity(
      this,
      "players",
      "targetable",
      "dynamic"
    );

    this.position = new Position(100, 100);
    this.radius = new Radius(10);
    this.path = new Path(this.engine, this.position, 100, this.engine.map);
    this.health = new Health(this.engine, 1000, 0.01);
    this.shield = new Shield();

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;

    this.actions = { q: 0, w: 0, e: 0, s: 0 };
    this.actionsUse = { q: 0, w: 0, e: 0, s: 0 };

    this.abilities = {
      q: new RangeAttack(engine, this),
      w: new MeleeAttack(engine, this),
      e: new SelfShield(engine, this),
    }; //contains upto 3 abilities at members q,w,e

    this.currentPit = null;
    this.renderedPits = [];

    this.playerHit = this.engine.newEvent();
  }

  setInput(input) {
    if (!this.mouseDown && input.mouseDown) this.path.isMoving = true;

    this.actions = input.actions;
    this.actionsUse.q = input.actionsUse.q ? 1 : this.actionsUse.q;
    this.actionsUse.w = input.actionsUse.w ? 1 : this.actionsUse.w;
    this.actionsUse.e = input.actionsUse.e ? 1 : this.actionsUse.e;

    this.mouseX = input.mouseX;
    this.mouseY = input.mouseY;
    this.mouseDown = input.mouseDown;

    if (input.actions.s) {
      this.path.isMoving = false;
      this.actionsUse.q = 0;
      this.actionsUse.w = 0;
      this.actionsUse.e = 0;
    }
  }

  getState() {
    return {
      id: this.id,
      entityX: this.position.x,
      entityY: this.position.y,
      maxHealth: this.health.max,
      health: this.health.current,
      shield: this.shield.current,
      q: this.abilities.q.getState(),
      w: this.abilities.w.getState(),
      e: this.abilities.e.getState(),
    };
  }

  update() {
    if (this.health.current <= 0) this.reset();

    this.health.regen = this.health.max * (this.playerHit.timeSince() > 10 ? 0.1 : 0.01);

    this.health.update();

    if (this.path.isMoving && this.mouseDown)
      this.path.setPath(
        this.position.x + this.mouseX,
        this.position.y + this.mouseY
      );

    this.path.update();

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
    const pitCheck = this.engine.map.checkPitOnPoint(
      [this.position.x, this.position.y],
      this.radius.current
    );
    if (this.currentPit !== pitCheck) {
      if (this.currentPit) {
        this.currentPit.removePlayer(this);
      }
      if (pitCheck) {
        pitCheck.addPlayer(this);
      }
      this.currentPit = pitCheck;
    }

    this.renderedPits = this.engine.map.getRenderedPits([
      this.position.x,
      this.position.y,
    ]);
  }

  sendPlayerTick(players, globalData) {
    const entities = [...globalData];
    for (let index = 0; index < this.renderedPits.length; index++)
      entities.push(...this.renderedPits[index].getEntitiesState());

    this.ws.send(
      JSON.stringify({
        type: "tick",
        players,
        entities,
      })
    );
  }

  reset() {
    this.health.reset();
    this.shield.reset();
    this.position.reset();
    this.path.reset();
  }

  takeDamage(amount) {
    const initialAmount = amount;
    amount = this.shield.takeDamage(amount);
    this.health.takeDamage(amount);
    if (amount > 0) this.playerHit.update();
    return { sheildDamage: initialAmount - amount, healthDamage: amount };
  }

  delete() {
    this.entity
      .removeGroup("players", "targetable", "dynamic")
      .addGroup("playerGraveyard");
    if (this.currentPit) this.currentPit.removePlayer(this);
  }

  rejoin(ws) {
    this.ws = ws;
    this.entity
      .addGroup("players", "targetable", "dynamic")
      .removeGroup("playerGraveyard");
    if (this.currentPit) this.currentPit.addPlayer(this);
  }
}

module.exports = { Player };
