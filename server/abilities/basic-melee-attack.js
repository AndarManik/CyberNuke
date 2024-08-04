const { players, entities, globalEntities, targetable } = require("../state.js");
const { v4: uuidv4 } = require("uuid");
const {DamageIndicatorEntity} = require("../damage-indicator.js");

class BasicMeleeAttack {
  constructor(caster) {
    this.caster = caster;

    this.cooldown = 4 * 60;
    this.countdown = 0;
    this.castRange = 50;
  }

  update() {
    if (this.countdown > 0) this.countdown--;
  }

  use() {
    if (this.countdown > 0) return;

    const player = players[this.caster];
    const trueMouseX = player.entityX + player.mouseX;
    const trueMouseY = player.entityY + player.mouseY;

    const targetInCastRange = Object.keys(targetable)
      .map((key) => ({
        key,
        distance: Math.sqrt(
          Math.pow(targetable[key].entityX - player.entityX, 2) +
            Math.pow(targetable[key].entityY - player.entityY, 2)
        ),
      }))
      .filter((target) => {
        return (
          target.distance < this.castRange + 10 &&
          target.key != this.caster
        );
      });

    if (targetInCastRange.length == 0) return;

    const enemiesNearCursor = targetInCastRange
      .map((target) => {
        target.distance = Math.sqrt(
          Math.pow(targetable[target.key].entityX - trueMouseX, 2) +
            Math.pow(targetable[target.key].entityY - trueMouseY, 2)
        );
        return target;
      })
      .sort((a, b) => a.distance - b.distance);

    if (enemiesNearCursor.length == 0) return;

    const receiver = enemiesNearCursor[0].key;

    new BasicMeleeAttackEntity(this.caster, receiver);

    this.countdown = this.cooldown;
  }

  getState() {
    return {
      cooldown: Math.min(1, (this.cooldown - this.countdown) / this.cooldown),
      castRange: this.castRange,
    };
  }
}

class BasicMeleeAttackEntity {
  constructor(caster, receiver) {
    this.id = uuidv4();
    this.caster = caster;
    this.receiver = receiver;

    entities[this.id] = this;
    globalEntities[this.id] = this;

    this.framesToHit = 0.1 * 60;
    this.framesSinceCast = 0;

    this.direction = Math.atan2(
      targetable[this.receiver].entityX - players[this.caster].entityX,
      -1 * (targetable[this.receiver].entityY - players[this.caster].entityY)
    );
    this.damage = 100;
  }

  update() {
    if (!(this.receiver in targetable)) {
      delete entities[this.id];
      delete globalEntities[this.id];

      return;
    }

    this.framesSinceCast++;
    this.direction = Math.atan2(
      targetable[this.receiver].entityX - players[this.caster].entityX,
      -1 * (targetable[this.receiver].entityY - players[this.caster].entityY)
    );
    if (this.framesSinceCast >= this.framesToHit) {
      targetable[this.receiver].takeDamage(this.damage); //This will need to change to utilize a damage exchange method
      new DamageIndicatorEntity(this.damage, this.caster, this.receiver)
      delete entities[this.id];
      delete globalEntities[this.id];

    }
  }

  getState() {
    return {
      type: "basic melee attack",
      id: this.id,
      caster: this.caster,
      receiver: this.receiver,
      direction: this.direction,
    };
  }
}

module.exports = { BasicMeleeAttack };
