const { Target } = require("../../entity-components/components.js");
const MeleeAttackEntity = require("./melee-attack-entity.js");
class MeleeAttack {
  constructor(engine, caster) {
    this.engine = engine;
    this.caster = caster;
    this.cooldown = 4;
    this.castRange = 50;

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

    const targetedEntity = this.target.point([
      this.caster.position.x + this.caster.mouseX,
      this.caster.position.y + this.caster.mouseY,
    ]);

    if (targetedEntity) {
      new MeleeAttackEntity(this.engine, this.caster.id, targetedEntity.id);
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

module.exports =  MeleeAttack;
