import {
  player,
  otherPlayers,
  getUserId,
} from "../client-state.js";
import { gameWindow } from "../elements.js";
class BasicRangeAttack { //HECTIC: I want to send the cast indicators from the server instead of it being stored on the client.
  constructor() {
    this.cooldown = 1;
    this.castRange = 400;
    this.element = document.createElement("div");
    this.element.style.width = this.castRange;
    this.element.style.height = this.castRange;
    this.element.style.borderRadius = this.castRange + "px";
    this.element.style.backgroundColor = "oklch(60% 0.125 24 / 0.05)";

    this.element.style.border = "1px solid oklch(60% 0.125 24 / 0.1)";

    this.element.style.left = 350 - this.castRange / 2;
    this.element.style.top = 350 - this.castRange / 2;

    this.element.style.display = "none";
    this.element.style.position = "absolute";

    gameWindow.append(this.element);
  }

  setState(state) {
    this.cooldown = state.cooldown;
    this.castRange = state.castRange * 2;
    this.element.style.left = 350 - this.castRange / 2;
    this.element.style.top = 350 - this.castRange / 2;
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

class BasicRangeAttackEntity {
  constructor(state) {
    this.player = player;

    this.caster = state.caster == getUserId() ? player : otherPlayers[state.caster];
    this.receiver =
      state.receiver == getUserId() ? player : otherPlayers[state.receiver];

    this.entityX = state.entityX;
    this.entityY = state.entityY;

    this.element = document.createElement("div");
    this.element.style.height = "10px";
    this.element.style.width = "10px";
    this.element.style.backgroundColor = "oklch(70% 0.15 24)";

    this.element.style.borderRadius = "15px";
    this.element.style.position = "absolute";
    this.element.style.left = 350 - 5;
    this.element.style.top = 350 - 5;

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

export { BasicRangeAttackEntity, BasicRangeAttack };
