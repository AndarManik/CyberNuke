const { players, entities, globalEntities, targetable } = require("../state.js");
const { v4: uuidv4 } = require("uuid");
const {DamageIndicatorEntity} = require("../damage-indicator.js");

class BasicRangeAttack {
  constructor(caster) {
    this.caster = caster;

    this.cooldown = 3 * 60;
    this.countdown = 0;
    this.castRange = 100;
  }

  update() {
    if (this.countdown > 0) this.countdown--;
  }

  use() {
    if (this.countdown > 0) return;
    if( !(this.caster in players) ) return;

    const player = players[this.caster];
    
    const trueMouseX = player.entityX + player.mouseX;
    const trueMouseY = player.entityY + player.mouseY;

    const enemiesInCastRange = Object.keys(targetable)
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

    if (enemiesInCastRange.length == 0) return;

    const enemiesNearCursor = enemiesInCastRange
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
    globalEntities[this.id] = this;

    this.movespeed = 7.5;
    this.entityX = players[this.caster].entityX;
    this.entityY = players[this.caster].entityY;
    this.damage = 60;
  }

  update() {
    if (!(this.receiver in targetable)) {
      delete entities[this.id];
      delete globalEntities[this.id];

      return;
    }

    const dx = this.entityX - targetable[this.receiver].entityX;
    const dy = this.entityY - targetable[this.receiver].entityY;
    const distBetween = Math.sqrt(dx * dx + dy * dy);

    this.entityX -= dx / distBetween * this.movespeed;
    this.entityY -= dy / distBetween * this.movespeed;

    if(distBetween <= this.movespeed) {
      if (targetable[this.receiver]) {
        targetable[this.receiver].takeDamage(this.damage);
        new DamageIndicatorEntity(this.damage, this.caster, this.receiver)
      }
      delete entities[this.id];
      delete globalEntities[this.id];

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
