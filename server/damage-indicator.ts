// HECTIC: make a total damage which shows along side the regular damage this should stay still above the receiver

import Engine from "./engine/engine";
import { Dynamic } from "./engine/entity";
import Event from "./engine/event";

// MAYHEM: make the damage transaction system / object. It should track information of relevant damage history per damagable entity.
class DamageIndicatorEntity implements Dynamic{
  id: string
  engine: Engine;
  damageDealt:number;
  caster: string;
  receiver: string;
  timeToRemove: number;
  start: Event;
  velocityX: number;
  velocityY: number;
  entityX: number;
  entityY: number;

  constructor(engine: Engine, damageDealt: number, caster: string, receiver: string) {
    this.engine = engine;
    this.engine.registerEntity(this).isDynamic(this).isGlobal(this);

    this.damageDealt = damageDealt;
    this.caster = caster;
    this.receiver = receiver;

    this.timeToRemove = 0.75;
    this.start = this.engine.newEvent();
    this.velocityX =
      Math.random() < 0.5 ? 30 + Math.random() * 30 : -30 - Math.random() * 30;
    this.velocityY = -120;

    const receiverEntity = this.engine.groups.targetable.get(this.receiver);
    if(!receiverEntity) {
      this.remove();
      return;
    }

    this.entityX = receiverEntity.position.x;
    this.entityY = receiverEntity.position.y;
  }

  update() {
    if (this.start.timeSince() >= this.timeToRemove) {
      this.remove();
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

  remove() {
    this.engine.removeEntity(this);
  }
}

export default DamageIndicatorEntity;
