const { players, entities } = require("../state.js");
const { v4: uuidv4 } = require("uuid");
const {DamageIndicatorEntity} = require("../damage-indicator.js");

class BasicMeleeAttack {
  constructor(caster) {
    this.caster = caster;

    this.cooldown = 1 * 60;
    this.countdown = 0;
    this.castRange = 50;
  }

  update() {
    if (this.countdown > 0) this.countdown--;
  }

  use() {
    if (this.countdown > 0) return;

    const player = players[this.caster];
    const trueMouseX = player.playerX + player.mouseX;
    const trueMouseY = player.playerY + player.mouseY;

    const enemiesInCastRange = Object.keys(players)
      .map((key) => ({
        key,
        distance: Math.sqrt(
          Math.pow(players[key].playerX - player.playerX, 2) +
            Math.pow(players[key].playerY - player.playerY, 2)
        ),
      }))
      .filter((otherPlayer) => {
        return (
          otherPlayer.distance < this.castRange + 10 &&
          otherPlayer.key != this.caster
        );
      });

    if (enemiesInCastRange.length == 0) return;

    const enemiesNearCursor = enemiesInCastRange
      .map((otherPlayer) => {
        otherPlayer.distance = Math.sqrt(
          Math.pow(players[otherPlayer.key].playerX - trueMouseX, 2) +
            Math.pow(players[otherPlayer.key].playerY - trueMouseY, 2)
        );
        return otherPlayer;
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

    this.framesToHit = 0.1 * 60;
    this.framesSinceCast = 0;

    this.direction = Math.atan2(
      players[this.receiver].playerX - players[this.caster].playerX,
      -1 * (players[this.receiver].playerY - players[this.caster].playerY)
    );
    this.damage = 50;
  }

  update() {
    if (!(this.receiver in players)) {
      delete entities[this.id];
      return;
    }

    this.framesSinceCast++;
    this.direction = Math.atan2(
      players[this.receiver].playerX - players[this.caster].playerX,
      -1 * (players[this.receiver].playerY - players[this.caster].playerY)
    );
    if (this.framesSinceCast >= this.framesToHit) {
      players[this.receiver].takeDamage(this.damage); //This will need to change to utilize a damage exchange method
      new DamageIndicatorEntity(this.damage, this.caster, this.receiver)
      delete entities[this.id];
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
