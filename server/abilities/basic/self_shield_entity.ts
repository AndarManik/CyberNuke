import Engine from "../../engine/engine";
import Event from "../../engine/event";

class SelfShieldEntity {
  id: string;
  engine: Engine;
  caster: string;
  timeToFinish: number;
  shieldHealth: number;
  startTime: Event;

  constructor(engine: Engine, caster: string) {
    this.engine = engine;
    this.caster = caster;
    this.engine.registerEntity(this).isDynamic(this).isGlobal(this);

    this.timeToFinish = 1.5;
    this.shieldHealth = 200;

    const entities = this.getRequiredOrRemove();

    if(!entities) return;

    entities.caster.shield.add(this.shieldHealth, this.id);

    this.startTime = this.engine.newEvent();
  }

  update() {
    const entities = this.getRequiredOrRemove();

    if(!entities) return;

    if (!entities.caster.shield.has(this.id)) {
      this.remove();
      return;
    }
    if (this.startTime.timeSince() >= this.timeToFinish) {
      entities.caster.shield.remove(this.id);
      this.remove();
      return;
    }
  }

  getState() {
    const entities = this.getRequiredOrRemove();

    if(!entities) return;

    return {
      type: "basic shield",
      id: this.id,
      entityX: entities.caster.position.x,
      entityY: entities.caster.position.y,
    };
  }

  getRequiredOrRemove() {
    const caster = this.engine.groups.players.get(this.caster);

    if(!caster) {
      this.remove();
      return null;
    }

    return {caster};
  }

  remove() {
    this.engine.removeEntity(this);
  }
}

export default SelfShieldEntity;
