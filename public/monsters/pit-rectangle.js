class PitRectangleEntity {
  constructor(player, state) {
    this.player = player;

    this.entityX = state.entityX;
    this.entityY = state.entityY;

    this.element = document.createElement("div");
    const style = this.element.style;
    style.width = state.width;
    style.height = state.height;
    style.left = 350 - state.width / 2;
    style.top = 350 - state.height / 2;
    style.position = "absolute";
    style.backgroundColor = "hsl(250, 14%, 20%)";

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

export { PitRectangleEntity };
