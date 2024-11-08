class MeleeAttackDrop {
  constructor(engine, entityX, entityY) {
    this.entity = engine.newEntity(this, "global", "drops");
    this.state = {
      type: "drop",
      entityX: entityX,
      entityY: entityY,
      id: this.id,
    };
  }

  getState() {
    return this.state;
  }

  pickup(player) {
    this.entity.remove();
  }

  // HECTIC: make it so that when this is hovered in game the ability stats are shown
}

module.exports = MeleeAttackDrop;