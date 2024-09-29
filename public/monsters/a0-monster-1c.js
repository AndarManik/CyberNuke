import { gameWindow } from "../elements.js";
class A0Monster1Entity {
  constructor(player, state) {
    this.player = player;
    // Create SVG element
    this.element = document.createElement("div");
    this.element.style.position = "absolute";
    this.element.style.width = 30;
    this.element.style.height = 30;
    this.element.style.left = `335px`; // 350 - 20
    this.element.style.top = "335px";

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", "30");
    this.svg.setAttribute("height", "30");

    const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    mask.setAttribute("id", `cutout${state.id}`);

    const circle1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse"
    );
    circle1.setAttribute("cx", "15");
    circle1.setAttribute("cy", "15");
    circle1.setAttribute("rx", "10");
    circle1.setAttribute("ry", "15");
    circle1.setAttribute("fill", "white");
    mask.appendChild(circle1);

    const circle2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse"
    );
    circle2.setAttribute("cx", "15");
    circle2.setAttribute("cy", "10.35");
    circle2.setAttribute("rx", "7.5");
    circle2.setAttribute("ry", "11.25");
    circle2.setAttribute("fill", "black");
    mask.appendChild(circle2);

    const circle5 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle5.setAttribute("cx", "15");
    circle5.setAttribute("cy", "25");
    circle5.setAttribute("r", "7.5");
    circle5.setAttribute("fill", "black");
    mask.appendChild(circle5);

    this.svg.appendChild(mask);

    const circle3 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse"
    );
    circle3.setAttribute("cx", "15");
    circle3.setAttribute("cy", "15");
    circle3.setAttribute("rx", "10");
    circle3.setAttribute("ry", "15");

    circle3.setAttribute("fill", `hsl(${state.color}, 65%, 65%)`);
    circle3.setAttribute("mask", `url(#cutout${state.id})`);
    this.svg.appendChild(circle3);

    const circle4 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle4.setAttribute("cx", "15");
    circle4.setAttribute("cy", "25");
    circle4.setAttribute("r", "5");

    circle4.setAttribute("fill", `hsl(${state.color}, 65%, 65%)`);
    this.svg.appendChild(circle4);

    this.svg.style.position = "absolute";

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

export { A0Monster1Entity };
