class PitEntity {
  constructor(player, state) {
    this.player = player;

    this.entityX = state.entityX;
    this.entityY = state.entityY;

    this.element = document.createElement("div");
    const style = this.element.style;
    style.width = state.radius * 2;
    style.height = state.radius * 2;
    style.left = 350 - state.radius;
    style.top = 350 - state.radius;
    style.borderRadius = state.radius + "px";
    style.position = "absolute";
    style.backgroundColor = "hsla(250, 14%, 20%, 0.2)";

    document.getElementById("gameWindow").append(this.element);
  }

  setState(state) {
    //do nothing
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

export { PitEntity };
