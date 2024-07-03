class Line {
  constructor(player, state) {
    this.player = player;

    this.startX = state.startX;
    this.startY = state.startY;
    this.endX = state.endX;
    this.endY = state.endY;
    this.element = document.createElement("div");
    this.element.classList.add("basicattack");
    this.element.style.left = 350 - 5;
    this.element.style.top = 350 - 5;

    document.getElementById("gameWindow").append(this.element);
  }

  setState(state) {
    this.entityX = state.entityX;
    this.entityY = state.entityY;
  }

  render() {
    this.element.style.transform = `translate(${
      this.entityX - this.player.playerX
    }px, ${this.entityY - this.player.playerY}px)`;
  }

  remove() {
    this.element.remove();
  }
}

export { Line };
