import { BasicMeleeAttack } from "./abilities/basic-melee-attack.js";
import { BasicRangeAttack } from "./abilities/basic-range-attack.js";
import { BasicShield } from "./abilities/basic-shield.js";

class Player {
  constructor() {
    //player input
    this.actions = { q: 0, w: 0, e: 0, s: 0 };
    this.actionsUse = { q: 0, w: 0, e: 0 };

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;

    //player state
    this.entityX = 0;
    this.entityY = 0;
    this.maxHealth = 200;
    this.health = 200;
    this.shield = 0;

    //ability state
    this.q = new BasicRangeAttack();
    this.w = new BasicMeleeAttack();
    this.e = new BasicShield();

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
        this.actions.q = 1;
        this.q.activate();
      }
      if (event.key === "w" || event.key === "W") {
        this.actions.w = 1;
        this.w.activate();
      }
      if (event.key === "e" || event.key === "E") {
        this.actions.e = 1;
        this.e.activate();
      }
      if (event.key === "s" || event.key === "S") {
        this.actions.s = 1;
        this.actions.q = 0;
        this.actions.w = 0;
        this.actions.e = 0;
        this.q.deactivate();
        this.w.deactivate();
        this.e.deactivate();

      }
    });

    document.addEventListener("keyup", (event) => {
      event.preventDefault();
      if (this.actions.q == 1 && (event.key === "q" || event.key === "Q")) {
        this.actions.q = 0;
        this.actionsUse.q = 1;
        this.q.deactivate();
      }
      if (this.actions.w == 1 && (event.key === "w" || event.key === "W")) {
        this.actions.w = 0;
        this.actionsUse.w = 1;
        this.w.deactivate();
      }
      if (this.actions.e == 1 && (event.key === "e" || event.key === "E")) {
        this.actions.e = 0;
        this.actionsUse.e = 1;
        this.e.deactivate();
      }
      if (event.key === "s" || event.key === "S") {
        this.actions.s = 0;
      }
    });
  }

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
      this.q.cooldown == 1
        ? "hsla(250, 14%, 35%, 0.533)"
        : `conic-gradient(hsla(250, 14%, 35%, 0.533) 0% ${
            100 * this.q.cooldown
          }%, #ff562200 0% 100%)`;
    this.abilitiesElement[1].style.background =
      this.w.cooldown == 1
        ? "hsla(250, 14%, 35%, 0.533)"
        : `conic-gradient(hsla(250, 14%, 35%, 0.533) 0% ${
            100 * this.w.cooldown
          }%, #ff562200 0% 100%)`;
    this.abilitiesElement[2].style.background =
      this.e.cooldown == 1
        ? "hsla(250, 14%, 35%, 0.533)"
        : `conic-gradient(hsla(250, 14%, 35%, 0.533) 0% ${
            100 * this.e.cooldown
          }%, #ff562200 0% 100%)`;

    this.q.render();
    this.w.render();
    this.e.render();
  }

  getInput() {
    const input = {
      actions: this.actions,
      actionsUse: this.actionsUse,
      mouseDown: this.mouseDown,
      mouseX: this.mouseX,
      mouseY: this.mouseY,
    };

    this.actionsUse = { q: 0, w: 0, e: 0 };

    return input;
  }

  setState(state) {
    this.entityX = state.entityX;
    this.entityY = state.entityY;
    this.maxHealth = state.maxHealth;
    this.health = state.health;
    this.shield = state.shield;
    this.q.setState(state.q);
    this.w.setState(state.w);
    this.e.setState(state.e);
  }
}

export { Player };
