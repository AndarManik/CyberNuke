import DamageIndicatorEntity from "../../damage-indicator";
import Engine from "../../engine/engine";

class RangeAttackEntity {
  id: string;
  engine: Engine;
  caster: string;
  receiver: string;
  values: {
    cooldown: number;
    castRange: number;
    damage: number;
    movespeed: number;
  };
  entityX: number;
  entityY: number;
  constructor(engine: Engine, caster: string, receiver: string) {
    this.engine = engine;
    this.caster = caster;
    this.receiver = receiver;

    this.values = engine.values.abilities.basic.rangeAttack;
    this.engine.registerEntity(this).isDynamic(this).isGlobal(this);

    const entities = this.getRequiredOrRemove();

    if(!entities) return;

    this.entityX = entities.caster.position.x;
    this.entityY = entities.caster.position.y;
  }

  update() {
    const entities = this.getRequiredOrRemove();

    if(!entities) return;

    const currentSpeed = this.values.movespeed * this.engine.getDelta();

    const dx =
      this.entityX - entities.receiver.position.x;
    const dy =
      this.entityY - entities.receiver.position.y;
    const distBetween = Math.sqrt(dx * dx + dy * dy);
    if (distBetween <= currentSpeed) {
      if (entities.receiver) {
        entities.receiver
          .takeDamage(this.values.damage);
        new DamageIndicatorEntity(
          this.engine,
          this.values.damage,
          this.caster,
          this.receiver
        );
      }
      this.remove();
      return;
    }
    this.entityX -= (dx / distBetween) * currentSpeed;
    this.entityY -= (dy / distBetween) * currentSpeed;
  }

  getRequiredOrRemove() {
    const receiver = this.engine.groups.targetable.get(this.receiver);
    const caster = this.engine.groups.players.get(this.caster);

    const bothExist = receiver && caster;
    if (!bothExist) {
      this.remove();
      return null;
    }

    return { receiver, caster };
  }

  remove() {
    this.engine.removeEntity(this);
  }

  getState() {
    // CALM: this should provide a color
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

export default RangeAttackEntity;
