class Shield {
  current: number;
  stack: { [id: string]: number };
  order: string[];

  constructor() {
      this.current = 0;
      this.stack = {};
      this.order = [];
  }

  reset(): void {
      this.current = 0;
      this.stack = {};
      this.order = [];
  }

  add(amount: number, id: string): void {
      this.current += amount;
      this.stack[id] = amount;
      this.order.push(id);
  }

  remove(id: string): void {
      if (!this.has(id)) return;
      this.current -= this.stack[id];
      delete this.stack[id];
      this.order.splice(this.order.indexOf(id), 1);
  }

  has(id: string): boolean {
      return id in this.stack;
  }

  takeDamage(amount: number): number {
      this.current = Math.max(0, this.current - amount);

      this.order.forEach((id) => {
          let overflow = 0;
          this.stack[id] -= amount;
          
          if (this.stack[id] <= 0) {
              overflow = -this.stack[id];
              this.remove(id);
          }

          amount = Math.max(0, overflow);
      });

      return amount;
  }
}

export default Shield;