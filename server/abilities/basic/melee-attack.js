const { Target } = require("../../entity-components/components.js");
const MeleeAttackEntity = require("./melee-attack-entity.js");
class MeleeAttack {
  constructor(engine, caster) {
    this.engine = engine;
    this.caster = caster;
    this.values = engine.values.abilities.a.meleeAttack;

    this.lastUse = this.engine.newEvent();

    this.target = new Target(
      this.caster.position,
      this.caster.radius,
      this.values.castRange,
      this.engine.targetable
    );
  }

  update() {}

  use() {
    if (this.lastUse.timeSince() < this.values.cooldown) return;

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
      cooldown: Math.min(1, this.lastUse.timeSince() / this.values.cooldown),
      castRange: this.values.castRange,
    };
  }
}

module.exports =  MeleeAttack;
