const { players, entities } = require("../state.js");
const { v4: uuidv4 } = require("uuid");

class BasicShield {
  constructor(caster) {
    this.caster = caster;

    this.cooldown = 2 * 60;
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

    this.entityX = players[this.caster].playerX;
    this.entityY = players[this.caster].playerY;

    this.framesToFinish = 1 * 60; //1 seconds
    this.framesSinceCast = 0;

    this.shieldHealth = 70;

    players[this.caster].addShield(this.shieldHealth, this.id);
  }

  update() {
    if(!(this.caster in players)){
      delete entities[this.id];
      return;
    } 

    this.entityX = players[this.caster].playerX;
    this.entityY = players[this.caster].playerY;

    this.framesSinceCast++;

    if(!players[this.caster].hasShield((this.id))) {//shield depleted on player
        delete entities[this.id];
    }

    if (this.framesSinceCast >= this.framesToFinish) {//shields duration is over
      players[this.caster].removeShield(this.id) ;
      delete entities[this.id];
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
