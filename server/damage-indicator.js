// HECTIC: make a total damage which shows along side the regular damage this should stay still above the receiver
class DamageIndicatorEntity {
  constructor(engine, damageDealt, caster, receiver) {
    this.engine = engine;
    this.entity = this.engine.newEntity(this, "dynamic", "global");

    this.damageDealt = damageDealt;
    this.caster = caster;
    this.receiver = receiver;

    this.timeToRemove = 0.75;
    this.start = this.engine.newEvent();
    this.velocityX =
      Math.random() < 0.5 ? 30 + Math.random() * 30 : -30 - Math.random() * 30;
    this.velocityY = -120;

    this.entityX = this.engine.targetable.get(this.receiver).position.x;
    this.entityY = this.engine.targetable.get(this.receiver).position.y;
  }

  update() {
    if (this.start.timeSince() >= this.timeToRemove) {
      this.entity.remove();
      return;
    }

    this.velocityY += 400 * this.engine.getDelta();

    this.entityX += this.velocityX * this.engine.getDelta();
    this.entityY += this.velocityY * this.engine.getDelta();
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

module.exports = DamageIndicatorEntity;
