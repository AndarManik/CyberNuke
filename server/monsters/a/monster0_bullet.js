const DamageIndicatorEntity = require("../../damage-indicator");

class AMonsterBullet {
  constructor(engine, receiverId, entityX, entityY, color, monster) {
    this.engine = engine;
    this.entity = this.engine.newEntity(this, "dynamic");

    this.receiverId = receiverId;
    this.entityX = entityX;
    this.entityY = entityY;
    this.color = color;
    this.monster = monster;

    this.accel = 250;
    this.movespeed = 5;
    this.damage = 40;
  }

  update() {
    if (!this.engine.targetable.has(this.receiverId)) {
      this.remove();
      return;
    }

    

    this.accel = Math.min(1200, this.accel + 1200 * this.engine.getDelta());
    this.movespeed = Math.min(
      480,
      this.movespeed + this.accel * this.engine.getDelta()
    );

    const dx =
      this.entityX - this.engine.targetable.get(this.receiverId).position.x;
    const dy =
      this.entityY - this.engine.targetable.get(this.receiverId).position.y;
    const distBetween = Math.sqrt(dx * dx + dy * dy);

    if (distBetween <= this.movespeed * this.engine.getDelta()) {
      if (this.engine.targetable.get(this.receiverId)) {
        this.engine.targetable.get(this.receiverId).takeDamage(this.damage);
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
    this.entity.remove();
    this.monster.bullet = null;
  }

  getState() {
    return {
      type: "a0monster0ability",
      entityX: this.entityX,
      entityY: this.entityY,
      id: this.id,
      color: this.color,
    };
  }
}

module.exports = AMonsterBullet;