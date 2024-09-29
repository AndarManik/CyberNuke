class SelfShieldEntity {
  constructor(engine, caster) {
    this.engine = engine;
    this.caster = caster;

    this.entity = this.engine.newEntity(this, "dynamic", "global");

    this.timeToFinish = 1.5;
    this.shieldHealth = 200;

    this.engine.players.get(this.caster).shield.add(this.shieldHealth, this.id);

    this.startTime = this.engine.newEvent();
  }

  update() {
    if (!this.engine.players.has(this.caster)) {
      this.remove();
      return;
    }
    if (!this.engine.players.get(this.caster).shield.has(this.id)) {
      this.remove();
      return;
    }
    if (this.startTime.timeSince() >= this.timeToFinish) {
      this.engine.players.get(this.caster).shield.remove(this.id);
      this.remove();
      return;
    }
  }

  getState() {
    return {
      type: "basic shield",
      id: this.id,
      entityX: this.engine.players.get(this.caster).position.x,
      entityY: this.engine.players.get(this.caster).position.y,
    };
  }

  remove() {
    this.entity.remove(this);
  }
}

module.exports = SelfShieldEntity;
