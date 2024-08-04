import { gameWindow } from "../clientState.js";
class BasicRangeAttack {
  constructor() {
    this.cooldown = 1;
    this.castRange = 400;
    this.element = document.createElement("div");
    this.element.style.width = this.castRange;
    this.element.style.height = this.castRange;
    this.element.style.borderRadius = this.castRange + "px";
    this.element.style.backgroundColor = "hsla(0, 65%, 65%, 0.05)";

    this.element.style.border = "1px solid hsla(0, 65%, 65%, 0.1)";

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
  constructor(player, state, otherPlayers, userID) {
    this.player = player;

    this.caster = state.caster == userID ? player : otherPlayers[state.caster];
    this.receiver =
      state.receiver == userID ? player : otherPlayers[state.receiver];

    this.entityX = state.entityX;
    this.entityY = state.entityY;

    this.element = document.createElement("div");
    this.element.style.height = "10px";
    this.element.style.width = "10px";
    this.element.style.backgroundColor = "hsl(0, 65%, 65%)";

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
