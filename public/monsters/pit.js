import { staticEntities } from "../elements.js";

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
    style.backgroundColor = `${state.color.replace(")", "/ 0.05")}`;
    style.border = `1px solid ${state.color.replace(")", "/ 0.075")}`
    style.boxShadow = `inset 0 0 5px 1px ${state.color.replace(")", "/ 0.02")}`;
    style.zIndex = 2;

    this.healthContainer = document.createElement("div");
    this.healthContainer.classList.add("healthBarPit");
    this.healthContainer.style.left = 403 + state.entityX - state.radius;
    this.healthContainer.style.top = 300 + state.entityY - state.radius;
    this.healthBar = document.createElement("div");
    this.healthBar.classList.add("currentHealthPit");
    this.healthBar.style.backgroundColor = `${state.color.replace("60%", "70%").replace("0.125", "0.15")}`;
    this.healthContainer.appendChild(this.healthBar);



    staticEntities.append(this.healthContainer);
    staticEntities.append(this.element);
    this.setState(state);
  }

  setState(state){
    this.maxHealth = state.maxHealth;
    this.health = state.health;
    this.isAlive = state.isAlive;

    if (!this.isAlive) {
      this.healthContainer.remove();
    }
  }
  render(){
    const currentPercentageHealth = Math.max(
      0,
      (100 * this.health) / this.maxHealth
    );

    this.healthBar.style.width = `${currentPercentageHealth}%`;
  }
  remove() {
    this.element.remove();
    this.healthContainer.remove();
  }
}

export { PitEntity };
