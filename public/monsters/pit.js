import { staticEntities } from "../clientState.js";

class PitEntity {
  constructor(player, state) {
    this.player = player;

    this.entityX = state.entityX;
    this.entityY = state.entityY;

    this.element = document.createElement("div");
    const style = this.element.style;
    style.width = state.radius * 2;
    style.height = state.radius * 2;
    style.left = 350 + state.entityX - state.radius;
    style.top = 350 + state.entityY - state.radius;
    style.borderRadius = state.radius + "px";
    style.position = "absolute";
    style.backgroundColor = `hsla(${state.color}, 20%, 45%, 0.05)`;
    style.border = `1px solid hsla(${state.color}, 20%, 45%, 0.2)`
    style.boxShadow = `inset 0 0 5px 1px hsla(${state.color}, 20%, 45%,0.2)`;
    style.zIndex = 2;
    staticEntities.append(this.element);
  }

  setState(data){}
  render(){}
  remove() {
    this.element.remove();
  }
}

export { PitEntity };
