const DamageIndicatorEntity = require("../../damage-indicator.js");

class MeleeAttackEntity {
  constructor(engine, caster, receiver) {
    this.engine = engine;
    this.caster = caster;
    this.receiver = receiver;
    this.values = engine.values.abilities.a.meleeAttack;
    this.entity = this.engine.newEntity(this, "dynamic", "global");


    this.direction = Math.atan2(
      this.engine.targetable.get(this.receiver).position.x -
        this.engine.players.get(this.caster).position.x,
      -1 *
        (this.engine.targetable.get(this.receiver).position.y -
          this.engine.players.get(this.caster).position.y)
    );

    this.startTime = this.engine.newEvent();

  }

  update() {
    if (!this.engine.targetable.has(this.receiver)) {
      this.entity.remove();
      return;
    }

    if (this.startTime.timeSince() >= this.values.timeToHit) {
      this.engine.targetable.get(this.receiver).takeDamage(this.values.damage); //This will need to change to utilize a damage exchange method
      new DamageIndicatorEntity(
        this.engine,
        this.values.damage,
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
