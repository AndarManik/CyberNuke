const { players, entities } = require("./state.js");
const { v4: uuidv4 } = require("uuid");

class DamageIndicatorEntity {
  constructor(damageDealt, caster, receiver) {
    this.id = uuidv4();
    entities[this.id] = this;

    this.damageDealt = damageDealt;
    this.caster = caster;
    this.receiver = receiver;

    this.framesToRemove = 0.4 * 60;
    this.framesShown = 0;

    this.velocityX =
      Math.random() < 0.5
        ? 0.5 + Math.random() * 0.5
        : -0.5 - Math.random() * 0.5;
    this.velocityY = -2;

    this.positionX = 0;
    this.positionY = 0;

    this.entityX = players[this.receiver].playerX;
    this.entityY = players[this.receiver].playerY;
  }

  update() {
    if (
      !(this.receiver in players) ||
      this.framesShown >= this.framesToRemove
    ) {
      delete entities[this.id];
      return;
    }

    this.velocityY += 0.2;

    this.positionX += this.velocityX;
    this.positionY += this.velocityY;

    this.entityX = players[this.receiver].playerX + this.positionX;
    this.entityY = players[this.receiver].playerY + this.positionY;

    this.framesShown++;
  }

  getState() {
    return {
      type: "damage indicator",
      id: this.id,
      caster: this.caster,
      receiver: this.receiver,
      entityX: this.entityX,
      entityY: this.entityY,
      damageDealt: this.damageDealt,
    };
  }
}

module.exports = { DamageIndicatorEntity };
