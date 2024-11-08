import { staticEntities } from "../elements.js";

class PitRectangleEntity {
  constructor(player, state) {
    this.player = player;

    this.element = document.createElement("div");
    const style = this.element.style;
    style.width = state.width;
    style.height = state.height;
    style.left = 350 + state.entityX - state.width / 2;
    style.top = 350 + state.entityY - state.height / 2;
    style.position = "absolute";
    style.backgroundColor = `${state.color}`;
    style.transform = `rotate(${state.rotation}deg)`;

    staticEntities.append(this.element);
  }
  setState(data){}
  render(){}
  remove(){
    this.element.remove();
  }
}

export { PitRectangleEntity };
