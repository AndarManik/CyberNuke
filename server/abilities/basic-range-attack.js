const { players, entities } = require("../state.js");
const { v4: uuidv4 } = require("uuid");
const {DamageIndicatorEntity} = require("../damage-indicator.js");

class BasicRangeAttack {
  constructor(caster) {
    this.caster = caster;

    this.cooldown = 0.2 * 60;
    this.countdown = 0;
    this.castRange = 200;
  }

  update() {
    if (this.countdown > 0) this.countdown--;
  }

  use() {
    if (this.countdown > 0) return;
    if( !(this.caster in players) ) return;

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

    new BasicRangeAttackEntity(this.caster, receiver);

    this.countdown = this.cooldown;
  }

  getState(){
    return {cooldown: Math.min(1, (this.cooldown - this.countdown) / this.cooldown), castRange: this.castRange};
  }
}

class BasicRangeAttackEntity {
  constructor(caster, receiver) {
    this.id = uuidv4();
    this.caster = caster;
    this.receiver = receiver;

    entities[this.id] = this;

    this.movespeed = 7.5;
    this.entityX = players[this.caster].playerX;
    this.entityY = players[this.caster].playerY;
    this.damage = 20;
  }

  update() {
    if (!(this.receiver in players)) {
      delete entities[this.id];
      return;
    }

    const dx = this.entityX - players[this.receiver].playerX;
    const dy = this.entityY - players[this.receiver].playerY;
    const distBetween = Math.sqrt(dx * dx + dy * dy);

    this.entityX -= dx / distBetween * this.movespeed;
    this.entityY -= dy / distBetween * this.movespeed;

    if(distBetween <= this.movespeed) {
      if (players[this.receiver]) {
        players[this.receiver].takeDamage(this.damage);
        new DamageIndicatorEntity(this.damage, this.caster, this.receiver)
      }
      delete entities[this.id];
    }
  }

  getState() {
    return {
      type: "basic range attack",
      entityX: this.entityX,
      entityY: this.entityY,
      id: this.id,
      caster: this.caster,
      receiver: this.receiver,
    };
  }
}

module.exports = { BasicRangeAttack };
