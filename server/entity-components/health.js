class Health {
  constructor(engine, maxHealth, regen) {
    this.engine = engine;

    this.current = maxHealth;
    this.max = maxHealth;
    this.originalMax = maxHealth;
    this.regen = regen || 0.0; //in hp/s
    this.multipliers = {};
  }

  update() {
    this.current = Math.min(
      this.max,
      this.current + this.regen * this.max * this.engine.getDelta()
    );
  }

  reset() {
    this.current = this.originalMax;
    this.max = this.originalMax;
    this.multipliers = {};
  }

  takeDamage(amount) {
    this.current -= amount;
    if (this.current >= 0) return 0;
    const remain = -this.current;
    this.current = 0;
    return remain;
  }

  isZero(){
    return this.current <= 0;
  }

  isFull() {
    return this.current === this.max;
  }

  addMultiplier(multiplier, id) {
    this.current *= multiplier;
    this.max *= multiplier;
    this.multipliers[id] = multiplier;
  }

  removeMultiplier(id) {
    if (this.multipliers[id]) {
      this.current /= this.multipliers[id];
      this.max /= this.multipliers[id];
      delete this.multipliers[id];
    }
  }
}

module.exports = { Health };