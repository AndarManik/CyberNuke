import { staticEntities } from "../elements.js";

class Drop {
  constructor(state) {
    //CALM: this shouldn't use the player data
    console.log("Drop built");
    this.element = document.createElement("div");
    const style = this.element.style;
    style.width = 15;
    style.height = 15;
    style.borderRadius = "15px";
    style.backgroundColor = "hsl(0, 0%, 65%)";

    style.left = 350 - 7.5 + state.entityX;
    style.top = 350 - 7.5 + state.entityY;
    style.position = "absolute";

    staticEntities.append(this.element);
  }

  setState(state){

  }

  render(){}

  remove() {
    this.element.remove();
  }
}

export {Drop};