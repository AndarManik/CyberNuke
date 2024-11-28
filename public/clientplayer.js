import { BasicMeleeAttack } from "./abilities/basic-melee-attack.js";
import { BasicRangeAttack } from "./abilities/basic-range-attack.js";
import { BasicShield } from "./abilities/basic-shield.js";

class Player {
  constructor() {
    //player input
    this.q = false;
    this.w = false;
    this.e = false;
    this.s = false;

    this.mouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;

    //player state
    this.entityX = 0;
    this.entityY = 0;
    this.maxHealth = 200;
    this.health = 200;
    this.shield = 0;

    //ability state
    this.abilityQ = new BasicRangeAttack();
    this.abilityW = new BasicMeleeAttack();
    this.abilityE = new BasicShield();

    this.initializeEventListeners();

    this.initializeDocumentElements();
  }

  initializeEventListeners() {
    document.addEventListener("mousedown", (event) => {
      event.preventDefault();
      this.mouseDown = true;
    });

    document.addEventListener("mouseup", (event) => {
      event.preventDefault();
      this.mouseDown = false;
    });

    document.addEventListener("mousemove", (event) => {
      event.preventDefault();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      this.mouseX = event.clientX - centerX;
      this.mouseY = event.clientY - centerY;
    });

    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      if (event.key === "q" || event.key === "Q") {
        this.q = true;
        this.abilityQ.activate();
      }
      if (event.key === "w" || event.key === "W") {
        this.w = true;
        this.abilityW.activate();
      }
      if (event.key === "e" || event.key === "E") {
        this.e = true;
        this.abilityE.activate();
      }
      if (event.key === "s" || event.key === "S") {
        this.s = true;
        this.q.deactivate();
        this.w.deactivate();
        this.e.deactivate();
      }
    });

    document.addEventListener("keyup", (event) => {
      event.preventDefault();
      if (event.key === "q" || event.key === "Q") {
        this.q = false;
        this.abilityQ.deactivate();
      }
      if (event.key === "w" || event.key === "W") {
        this.w = false;
        this.abilityW.deactivate();
      }
      if (event.key === "e" || event.key === "E") {
        this.e = false;
        this.abilityE.deactivate();
      }
      if (event.key === "s" || event.key === "S") {
        this.s = false;
      }
    });
  }

  // HECTIC: Something about this seems wrong I can't tell what but the fact that these elements exist already whereas everything else is constructed doesn't seem correct
  initializeDocumentElements() {
    this.healthElement = document.getElementById("health");
    this.currentHealthHudElement = document.getElementById("currentHealthHud");
    this.sheildElement = document.getElementById("shield");
    this.currentShieldHudElement = document.getElementById("currentShieldHud");
    this.backgroundElement = document.getElementById("background");
    this.staticEntitiesElement = document.getElementById("staticEntities");
    this.abilitiesElement = document.getElementById("abilities").children;
  }

  render() {
    //render health
    if (this.health + this.shield > this.maxHealth) {
      const currentPercentageHealth = Math.max(
        0,
        (100 * this.health) / (this.health + this.shield)
      );
      this.healthElement.style.width = `${currentPercentageHealth}%`;
      this.currentHealthHudElement.style.width = `${currentPercentageHealth}%`;

      this.sheildElement.style.width = `${100 - currentPercentageHealth}%`;
      this.currentShieldHudElement.style.width = `${
        100 - currentPercentageHealth
      }%`;
    } else {
      const currentPercentageHealth = Math.max(
        0,
        (100 * this.health) / this.maxHealth
      );
      const currentPercentageShield = Math.max(
        0,
        (100 * this.shield) / this.maxHealth
      );

      this.healthElement.style.width = `${currentPercentageHealth}%`;
      this.currentHealthHudElement.style.width = `${currentPercentageHealth}%`;

      this.sheildElement.style.width = `${currentPercentageShield}%`;
      this.currentShieldHudElement.style.width = `${currentPercentageShield}%`;
    }

    this.backgroundElement.style.transform = `translate(${-(
      this.entityX % 100
    )}px, ${-(this.entityY % 100)}px)`;
    this.staticEntitiesElement.style.transform = `translate(${-this
      .entityX}px, ${-this.entityY}px)`;

    //render abilities
    this.abilitiesElement[0].style.background =
      this.abilityQ.cooldown == 1
        ? "hsla(250, 14%, 35%, 0.533)"
        : `conic-gradient(hsla(250, 14%, 35%, 0.533) 0% ${
            100 * this.abilityQ.cooldown
          }%, #ff562200 0% 100%)`;
    this.abilitiesElement[1].style.background =
      this.abilityW.cooldown == 1
        ? "hsla(250, 14%, 35%, 0.533)"
        : `conic-gradient(hsla(250, 14%, 35%, 0.533) 0% ${
            100 * this.abilityW.cooldown
          }%, #ff562200 0% 100%)`;
    this.abilitiesElement[2].style.background =
      this.abilityE.cooldown == 1
        ? "hsla(250, 14%, 35%, 0.533)"
        : `conic-gradient(hsla(250, 14%, 35%, 0.533) 0% ${
            100 * this.abilityE.cooldown
          }%, #ff562200 0% 100%)`;

    this.abilityQ.render();
    this.abilityW.render();
    this.abilityE.render();
  }

  getInput() {
    const input = {
      q: this.q,
      w: this.w,
      e: this.e,
      s: this.s,
      mouseDown: this.mouseDown,
      mouseX: this.mouseX,
      mouseY: this.mouseY,
    };

    return input;
  }

  setState(state) {
    this.entityX = state.entityX;
    this.entityY = state.entityY;
    this.maxHealth = state.maxHealth;
    this.health = state.health;
    this.shield = state.shield;
    this.abilityQ.setState(state.q);
    this.abilityW.setState(state.w);
    this.abilityE.setState(state.e);
  }
}

export { Player };
