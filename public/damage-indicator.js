class DamageIndicatorEntity {
  constructor(player, state, userID) {
    this.player = player;

    this.element = document.createElement("div");
    const style = this.element.style;
    style.width = 50;
    style.height = 15;
    style.left = 350 - 25;
    style.top = 350 - 7.5;
    style.position = "absolute";
    style.fontSize = 12;
    style.color =
      state.caster == userID ? "hsl(250, 14%, 10%)" : "hsl(8, 75%, 55%)";
    style.zIndex = 5;
    this.element.innerText = state.damageDealt;

    document.getElementById("gameWindow").append(this.element);

    this.setState(state);
  }

  setState(state) {
    this.entityX = state.entityX;
    this.entityY = state.entityY;
  }

  render() {
    this.element.style.transform = `translate(${
      this.entityX - this.player.playerX + 20
    }px, ${this.entityY - this.player.playerY - 40}px)`;
  }

  remove() {
    this.element.remove();
  }
}

export { DamageIndicatorEntity };
