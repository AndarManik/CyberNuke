class Shield {
  constructor() {
    this.current = 0;
    this.stack = {};
    this.order = [];
  }

  reset() {
    this.curent = 0;
    this.stack = {};
    this.order = [];
  }

  add(amount, id) {
    this.current += amount;
    this.stack[id] = amount;
    this.order.push(id);
  }

  remove(id) {
    if (!this.has(id)) return;
    this.current -= this.stack[id];
    delete this.stack[id];
    this.order.splice(this.order.indexOf(id), 1);
  }

  has(id) {
    return id in this.stack;
  }

  takeDamage(amount) {
    this.current = Math.max(0, this.current - amount);
    this.order.forEach((id) => {
      this.stack[id] -= amount;
      if (this.stack[id] <= 0) {
        amount = -this.stack[id];
        this.remove(id);
      } else amount = 0;
    });
    return amount;
  }
}

module.exports = { Shield };
