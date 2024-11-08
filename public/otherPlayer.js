import { gameWindow } from "./elements.js";
class OtherPlayer {
  constructor(player, state) {
    this.player = player;
    this.element = document.createElement("div");
    this.element.classList.add("otherPlayer");
    this.element.style.left = 350 - 10;
    this.element.style.top = 350 - 10;

    const healthBar = document.createElement("div");
    healthBar.classList.add("healthBar");

    this.healthBar = document.createElement("div");
    this.healthBar.classList.add("currentHealth");
    this.healthBar.style.backgroundColor = "oklch(70% 0.15 24)";
    this.shieldBar = document.createElement("div");
    this.shieldBar.classList.add("currentShield");

    healthBar.appendChild(this.healthBar);
    healthBar.appendChild(this.shieldBar);
    this.element.append(healthBar);
    gameWindow.append(this.element);

    this.setState(state);
  }

  setState(state) {
    this.entityX = state.entityX;
    this.entityY = state.entityY;
    this.maxHealth = state.maxHealth;
    this.health = state.health;
    this.shield = state.shield;
  }

  render() {
    this.element.style.transform = `translate(${
      this.entityX - this.player.entityX
    }px, ${this.entityY - this.player.entityY}px)`;

    if (this.health + this.shield > this.maxHealth) {
      const currentPercentage = Math.max(
        0,
        (100 * this.health) / (this.health + this.shield)
      );
      this.healthBar.style.width = `${currentPercentage}%`;
      this.shieldBar.style.width = `${100 - currentPercentage}%`;
    } else {
      const currentPercentageHealth = Math.max(
        0,
        (100 * this.health) / this.maxHealth
      );
      const currentPercentageShield = Math.max(
        0,
        (100 * this.shield) / this.maxHealth
      );

      this.healthBar.style.width = `${currentPercentageHealth}%`;
      this.shieldBar.style.width = `${currentPercentageShield}%`;
    }
  }

  remove() {
    this.element.remove();
  }
}

export { OtherPlayer };
