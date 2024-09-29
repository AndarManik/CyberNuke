import {gameWindow} from "./elements.js"

class DamageIndicatorEntity {
  constructor(player, state, userID) {
    this.player = player;

    this.element = document.createElement("div");
    this.element.classList.add("damage");
    const style = this.element.style;
    style.width = 50;
    style.height = 15;
    style.left = 350 - 25;
    style.top = 350 - 7.5;
    style.position = "absolute";
    style.color =
      state.caster == userID ? "hsl(250, 6%, 85%)" : "hsl(8, 65%, 65%)";
    style.zIndex = 5;
    style.textShadow =
    state.caster == userID
      ? "0 0 10px hsl(250, 6%, 75%)"
      : "0 0 10px hsl(8, 65%, 65%)";

    style.fontSize = `${Math.log10(state.damageDealt + 10) * 0.45}rem`;
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
    }px, ${this.entityY - this.player.entityY - 10}px)`;
  }

  remove() {
    this.element.remove();
  }
}

export { DamageIndicatorEntity };
