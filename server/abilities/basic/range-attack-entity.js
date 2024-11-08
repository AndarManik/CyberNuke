const DamageIndicatorEntity = require("../../damage-indicator.js");

class RangeAttackEntity {
  constructor(engine, caster, receiver) {
    this.engine = engine;
    this.caster = caster;
    this.receiver = receiver;

    this.values = engine.values.abilities.a.rangeAttack;
    this.entity = this.engine.newEntity(this, "dynamic", "global");

    this.entityX = this.engine.players.get(this.caster).position.x;
    this.entityY = this.engine.players.get(this.caster).position.y;
  }

  update() {
    if (!this.engine.targetable.has(this.receiver)) {
      this.entity.remove();
      return;
    }

    const currentSpeed = this.values.movespeed * this.engine.getDelta();

    const dx =
      this.entityX - this.engine.targetable.get(this.receiver).position.x;
    const dy =
      this.entityY - this.engine.targetable.get(this.receiver).position.y;
    const distBetween = Math.sqrt(dx * dx + dy * dy);
    if (distBetween <= currentSpeed) {
      if (this.engine.targetable.has(this.receiver)) {
        this.engine.targetable.get(this.receiver).takeDamage(this.values.damage);
        new DamageIndicatorEntity(this.engine, this.values.damage, this.caster, this.receiver);
      }
      this.entity.remove();
      return;
    }
    this.entityX -= (dx / distBetween) * currentSpeed;
    this.entityY -= (dy / distBetween) * currentSpeed;
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

module.exports = RangeAttackEntity;
