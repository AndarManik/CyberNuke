const ShieldEntity = require("./self_shield_entity.js");
class SelfShield {
  constructor(engine, caster) {
    this.engine = engine;
    this.caster = caster;
    this.cooldown = 5;

    this.lastUse = this.engine.newEvent();
  }

  update() {}

  use() {
    if (this.lastUse.timeSince() < this.cooldown) return;
    new ShieldEntity(this.engine, this.caster.id);
    this.lastUse.update();
  }

  getState() {
    return {
      cooldown: Math.min(1, this.lastUse.timeSince() / this.cooldown),
    };
  }
}

module.exports = SelfShield;
