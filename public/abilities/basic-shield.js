import { gameWindow } from "../elements.js";
class BasicShield {
  constructor() {
    this.cooldown = 1;
    this.castRange = 40;
    this.element = document.createElement("div");
    this.element.style.width = this.castRange - 2;
    this.element.style.height = this.castRange - 2;
    this.element.style.borderRadius = this.castRange + "px";
    this.element.style.backgroundColor = "oklch(60% 0.125 216 / 0.05)";
    this.element.style.border = "1px solid oklch(60% 0.125 216 / 0.1)";

    this.element.style.left = 350 - this.castRange/2;
    this.element.style.top = 350 - this.castRange/2;

    this.element.style.display = "none";
    this.element.style.position = "absolute";

    gameWindow.append(this.element);
  }

  setState(state) {
    this.cooldown = state.cooldown;
    this.castRange = state.castRange * 2;
  }

  render() {
    this.element.style.width = this.castRange;
    this.element.style.height = this.castRange;
    this.element.style.borderRadius = this.castRange;
  }

  activate() {
    this.element.style.display = "block";
  }

  deactivate() {
    this.element.style.display = "none";
  }
}

class BasicShieldEntity {
  constructor(state, player) {
    this.player = player;

    this.entityX = state.entityX;
    this.entityY = state.entityY;

    this.element = document.createElement("div");
    const style = this.element.style;
    style.width = 40;
    style.height = 40;
    style.borderRadius = "40px";
    style.backgroundColor = "oklch(70% 0.15 216)";

    style.left = 350 - 20;
    style.top = 350 - 20;
    style.position = "absolute";

    gameWindow.append(this.element);
  }

  setState(state) {
    this.entityX = state.entityX;
    this.entityY = state.entityY;
  }

  render() {
    this.element.style.transform = `translate(${
      this.entityX - this.player.entityX
    }px, ${this.entityY - this.player.entityY}px)`;
  }

  remove() {
    this.element.remove();
  }
}

export { BasicShieldEntity, BasicShield };
