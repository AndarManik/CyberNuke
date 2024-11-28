import DamageIndicatorEntity from "../../damage-indicator";
import Engine from "../../engine/engine";
import Event from "../../engine/event";

class MeleeAttackEntity {
  id: string;
  engine: Engine;
  caster: string;
  receiver: string;
  values: {
    cooldown: number;
    castRange: number;
    damage: number;
    timeToHit: number;
  };
  direction: number;
  startTime: Event;

  constructor(engine: Engine, caster: string, receiver: string) {
    this.engine = engine;
    this.engine.registerEntity(this).isDynamic(this).isGlobal(this);
    this.caster = caster;
    this.receiver = receiver;
    this.values = engine.values.abilities.basic.meleeAttack;

    const entities = this.getRequiredOrRemove();

    if (!entities) return;

    this.direction = Math.atan2(
      entities.receiver.position.x - entities.caster.position.x,
      -1 * (entities.receiver.position.y - entities.caster.position.y)
    );

    this.startTime = this.engine.newEvent();
  }

  update() {
    console.log(this.direction);
    const entities = this.getRequiredOrRemove();

    if (!entities) return;

    if (this.startTime.timeSince() >= this.values.timeToHit) {
      entities.receiver.takeDamage(this.values.damage); //This will need to change to utilize a damage exchange method
      new DamageIndicatorEntity(
        this.engine,
        this.values.damage,
        this.caster,
        this.receiver
      );
      this.remove();
      return;
    }

    this.direction = Math.atan2(
      entities.receiver.position.x - entities.caster.position.x,
      -1 * (entities.receiver.position.y - entities.caster.position.y)
    );
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
    const entities = this.getRequiredOrRemove();

    if (!entities) return {};

    return {
      type: "basic melee attack",
      id: this.id,
      entityX: entities.caster.position.x,
      entityY: entities.caster.position.y,
      direction: this.direction,
    };
  }
}

export default MeleeAttackEntity;
