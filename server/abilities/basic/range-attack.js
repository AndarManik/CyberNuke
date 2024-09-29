const { Target } = require("../../entity-components/components.js");

const RangeAttackEntity = require("./range-attack-entity.js");

class RangeAttack {
  constructor(engine, caster) {
    this.engine = engine;
    this.caster = caster;
    this.cooldown = 3;
    this.castRange = 100;

    this.lastUse = this.engine.newEvent();

    this.target = new Target(
      this.caster.position,
      this.caster.radius,
      this.castRange,
      this.engine.targetable
    );
  }

  update() {}

  use() {
    if (this.lastUse.timeSince() < this.cooldown) return;
    
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
      cooldown: Math.min(1, this.lastUse.timeSince() / this.cooldown),
      castRange: this.castRange,
    };
  }
}

module.exports = RangeAttack;
