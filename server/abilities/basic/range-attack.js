const { Target } = require("../../entity-components/components.js");

const RangeAttackEntity = require("./range-attack-entity.js");

class RangeAttack {
  constructor(engine, caster) {
    this.engine = engine;
    this.caster = caster;
    this.values = engine.values.abilities.basic.rangeAttack;

    this.target = new Target(
      this.caster.position,
      this.caster.radius,
      this.values.castRange,
      this.engine.targetable
    );

    this.lastUse = this.engine.newEvent();
  }

  update() {}

  use() {
    if (this.lastUse.timeSince() < this.values.cooldown) return;
    
    const trueMouseX = this.caster.position.x + this.caster.mouseX;
    const trueMouseY = this.caster.position.y + this.caster.mouseY;
    const targetedEntity = this.target.point([trueMouseX, trueMouseY]);
    if (targetedEntity) {
      new RangeAttackEntity(this.engine, this.caster.id, targetedEntity.id);
      this.lastUse.update();
    }
  }

  getState() {
    return {
      cooldown: Math.min(1, this.lastUse.timeSince() / this.values.cooldown),
      castRange: this.values.castRange,
    };
  }
}

module.exports = RangeAttack;
