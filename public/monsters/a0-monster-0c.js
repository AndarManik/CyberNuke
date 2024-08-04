import { gameWindow } from "../clientState.js";
class A0Monster0Entity {
  constructor(player, state) {
    this.player = player;
    // Create SVG element
    this.element = document.createElement("div");
    this.element.style.position = "absolute";
    this.element.style.width = 20;
    this.element.style.height = 20;
    this.element.style.left = `340px`; // 350 - 20
    this.element.style.top = "340px";

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", "20");
    this.svg.setAttribute("height", "20");

    const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    mask.setAttribute("id", "cutout");

    const circle1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle1.setAttribute("cx", "10");
    circle1.setAttribute("cy", "10");
    circle1.setAttribute("r", "10");
    circle1.setAttribute("fill", "white");
    mask.appendChild(circle1);

    const circle2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle2.setAttribute("cx", "10");
    circle2.setAttribute("cy", "6.9");
    circle2.setAttribute("r", "7.5");
    circle2.setAttribute("fill", "black");
    mask.appendChild(circle2);

    this.svg.appendChild(mask);

    const circle3 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle3.setAttribute("cx", "10");
    circle3.setAttribute("cy", "10");
    circle3.setAttribute("r", "10");
    circle3.setAttribute("fill", `hsl(${state.color}, 65%, 65%)`);
    circle3.setAttribute("mask", "url(#cutout)");
    this.svg.appendChild(circle3);

    this.svg.style.position = "absolute";

    this.bullet = document.createElement("div");
    this.bullet.style.height = "10px";
    this.bullet.style.width = "10px";
    this.bullet.style.backgroundColor = `hsl(${state.color}, 65%, 65%)`;

    this.bullet.style.borderRadius = "15px";
    this.bullet.style.top = 1;
    this.bullet.style.left = 5;

    this.bullet.style.position = "absolute";

    this.element.append(this.bullet);

    this.healthContainer = document.createElement("div");
    this.healthContainer.classList.add("healthBar");
    this.healthContainer.style.left = `325px`; // 350 - 20
    this.healthContainer.style.top = "325px";

    this.healthBar = document.createElement("div");
    this.healthBar.classList.add("currentHealth");
    this.healthBar.style.backgroundColor = "hsl(55, 35%, 45%)";
    this.healthContainer.appendChild(this.healthBar);

    this.element.append(this.svg);
    gameWindow.append(this.element);
    gameWindow.append(this.healthContainer);
    this.setState(state);
  }

  setState(state) {
    this.entityX = state.entityX;
    this.entityY = state.entityY;
    this.maxHealth = state.maxHealth;
    this.health = state.health;
    this.direction = state.direction;
    this.isShooting = state.isShooting;
  }

  render() {
    this.element.style.transform = `translate(${
      this.entityX - this.player.entityX
    }px, ${this.entityY - this.player.entityY}px) rotate(${
      57.3 * this.direction
    }deg)`;

    if (this.isShooting) {
      this.bullet.style.display = "none";
    } else {
      this.bullet.style.display = "block";
    }

    this.healthContainer.style.transform = `translate(${
      this.entityX - this.player.entityX
    }px, ${this.entityY - this.player.entityY}px)`;

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

class A0Monster0EntityAbility {
  constructor(player, state) {
    this.player = player;

    this.entityX = state.entityX;
    this.entityY = state.entityY;

    this.element = document.createElement("div");
    this.element.style.height = "10px";
    this.element.style.width = "10px";
    this.element.style.backgroundColor = `hsl(${state.color}, 65%, 65%)`;

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

export { A0Monster0Entity, A0Monster0EntityAbility };
