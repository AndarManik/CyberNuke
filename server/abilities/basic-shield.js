const { players, entities, globalEntities } = require("../state.js");
const { v4: uuidv4 } = require("uuid");

class BasicShield {
  constructor(caster) {
    this.caster = caster;

    this.cooldown = 5 * 60;
    this.countdown = 0;
  }

  update() {
    if (this.countdown > 0) this.countdown--;
  }

  use() {
    if (this.countdown > 0) return;
    new BasicShieldEntity(this.caster);
    this.countdown = this.cooldown;
  }

  getState() {
    return {
      cooldown: Math.min(1, (this.cooldown - this.countdown) / this.cooldown),
    };
  }
}

class BasicShieldEntity {
  constructor(caster) {
    this.id = uuidv4();
    this.caster = caster;

    entities[this.id] = this;
    globalEntities[this.id] = this;

    this.entityX = players[this.caster].entityX;
    this.entityY = players[this.caster].entityY;

    this.framesToFinish = 1.5 * 60; //1 seconds
    this.framesSinceCast = 0;

    this.shieldHealth = 200;

    players[this.caster].addShield(this.shieldHealth, this.id);
  }

  update() {
    if(!(this.caster in players)){
      delete entities[this.id];
      delete globalEntities[this.id];

      return;
    } 

    this.entityX = players[this.caster].entityX;
    this.entityY = players[this.caster].entityY;

    this.framesSinceCast++;

    if(!players[this.caster].hasShield((this.id))) {//shield depleted on player
        delete entities[this.id];
        delete globalEntities[this.id];

    }

    if (this.framesSinceCast >= this.framesToFinish) {//shields duration is over
      players[this.caster].removeShield(this.id) ;
      delete entities[this.id];
      delete globalEntities[this.id];

    }
  }

  getState() {
    return {
      type: "basic shield",
      id: this.id,
      entityX: this.entityX,
      entityY: this.entityY,
    };
  }
}

module.exports = { BasicShield };
