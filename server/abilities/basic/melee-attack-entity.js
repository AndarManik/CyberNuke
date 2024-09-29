const DamageIndicatorEntity = require("../../damage-indicator.js");

class MeleeAttackEntity {
  constructor(engine, caster, receiver) {
    this.engine = engine;
    this.caster = caster;
    this.receiver = receiver;

    this.entity = this.engine.newEntity(this, "dynamic", "global");

    this.timeToHit = 0.1;
    this.startTime = this.engine.newEvent();

    this.direction = Math.atan2(
      this.engine.targetable.get(this.receiver).position.x -
        this.engine.players.get(this.caster).position.x,
      -1 *
        (this.engine.targetable.get(this.receiver).position.y -
          this.engine.players.get(this.caster).position.y)
    );
    this.damage = 100;
  }

  update() {
    if (!this.engine.targetable.has(this.receiver)) {
      this.entity.remove();
      return;
    }

    if (this.startTime.timeSince() >= this.timeToHit) {
      this.engine.targetable.get(this.receiver).takeDamage(this.damage); //This will need to change to utilize a damage exchange method
      new DamageIndicatorEntity(
        this.engine,
        this.damage,
        this.caster,
        this.receiver
      );
      this.entity.remove(this);
      return;
    }

    this.direction = Math.atan2(
      this.engine.targetable.get(this.receiver).position.x -
        this.engine.players.get(this.caster).position.x,
      -1 *
        (this.engine.targetable.get(this.receiver).position.y -
          this.engine.players.get(this.caster).position.y)
    );
  }

  getState() {
    return {
      type: "basic melee attack",
      id: this.id,
      entityX: this.engine.players.get(this.caster).position.x,
      entityY: this.engine.players.get(this.caster).position.y,
      direction: this.direction,
    };
  }
}

module.exports = MeleeAttackEntity;
