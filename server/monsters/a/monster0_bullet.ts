import Engine from "../../engine/engine";
import { Dynamic, Targetable } from "../../engine/entity";
import { ColorSuite } from "../../engine/values";
import AMonster0 from "./monster0_";

import DamageIndicatorEntity from "../../damage-indicator";

class AMonsterBullet implements Dynamic {
  id: string;
  engine: Engine;
  targets: Map<string, Targetable>;

  receiverId: string;
  entityX: number;
  entityY: number;
  color: ColorSuite;
  monster: AMonster0;

  accel: number = 250;
  movespeed: number = 5;
  damage: number = 40;

  constructor(
    engine: Engine,
    receiverId: string,
    entityX: number,
    entityY: number,
    color: ColorSuite,
    monster: AMonster0
  ) {
    this.engine = engine;
    this.engine.registerEntity(this).isDynamic(this);
    this.targets = this.engine.groups.targetable;

    this.receiverId = receiverId;
    this.entityX = entityX;
    this.entityY = entityY;
    this.color = color;
    this.monster = monster;
  }

  update() {
    const target = this.targets.get(this.receiverId);
    if (!target) {
      this.remove();
      return;
    }

    this.accel = Math.min(1200, this.accel + 1200 * this.engine.getDelta());
    this.movespeed = Math.min(
      480,
      this.movespeed + this.accel * this.engine.getDelta()
    );

    const dx = this.entityX - target.position.x;
    const dy = this.entityY - target.position.y;
    const distBetween = Math.sqrt(dx * dx + dy * dy);

    if (distBetween <= this.movespeed * this.engine.getDelta()) {
      if (this.engine.groups.targetable.get(this.receiverId)) {
        target.takeDamage(this.damage);
        new DamageIndicatorEntity(
          this.engine,
          this.damage,
          this.id,
          this.receiverId
        );
      }
      this.remove();
      return;
    }

    this.entityX -=
      (dx / distBetween) * this.movespeed * this.engine.getDelta();
    this.entityY -=
      (dy / distBetween) * this.movespeed * this.engine.getDelta();
  }

  remove() {
    this.engine.removeEntity(this);
    this.monster.bullet = null;
  }

  getState() {
    return {
      type: "a0monster0ability",
      entityX: this.entityX,
      entityY: this.entityY,
      id: this.id,
      color: this.color.weak.dark,
    };
  }
}

export default AMonsterBullet;
