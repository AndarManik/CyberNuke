import {gameWindow} from "./clientState.js"

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
      state.caster == userID ? "hsl(250, 6%, 75%)" : "hsl(8, 65%, 65%)";

    style.textShadow =
      state.caster == userID
        ? "0 0 10px hsl(250, 6%, 75%)"
        : "0 0 10px hsl(8, 65%, 65%)";

    style.zIndex = 5;
    this.element.innerText = state.damageDealt;
    this.setState(state);

    gameWindow.append(this.element);
  }

  setState(state) {
    this.entityX = state.entityX;
    this.entityY = state.entityY;
  }

  render() {
    this.element.style.transform = `translate(${
      this.entityX - this.player.entityX + 20
    }px, ${this.entityY - this.player.entityY - 40}px)`;
  }

  remove() {
    this.element.remove();
  }
}

export { DamageIndicatorEntity };
