import { BasicMeleeAttack } from "./abilities/basic-melee-attack.js";
import { BasicRangeAttack } from "./abilities/basic-range-attack.js";
import { BasicShield }      from "./abilities/basic-shield.js";

//This class is responsible for handling both input events and player rendering,
//that should change.

//The state of the inputs changes deterministically from the users input,
//that is it will never depend on previous state.

//Both abilities as well as health are rendered by this class
class Player {
  constructor() {

    //player input
    this.actions = { q: 0, w: 0, e: 0, s: 0 };
    this.actionsUse = { q: 0, w: 0, e: 0};

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;

    //player state
    this.playerX = 0;
    this.playerY = 0;
    this.maxHealth = 200;
    this.health = 200;
    this.shield = 0;

    //ability state
    this.q = new BasicRangeAttack();
    this.w = new BasicMeleeAttack();
    this.e = new BasicShield();


    this.initializeEventListeners();
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
      }
    });

    document.addEventListener("keyup", (event) => {
      event.preventDefault();
      if (event.key === "q" || event.key === "Q") {
        this.actions.q = 0;
        this.actionsUse.q = 1;
        this.q.deactivate();
      }
      if (event.key === "w" || event.key === "W") {
        this.actions.w = 0;
        this.actionsUse.w = 1;
        this.w.deactivate();
      }
      if (event.key === "e" || event.key === "E") {
        this.actions.e = 0;
        this.actionsUse.e = 1;
        this.e.deactivate();
      }
      if (event.key === "s" || event.key === "S") {
        this.actions.s = 0;
      }
    });
  }

  render() {
    //render health
    if(this.health + this.shield > this.maxHealth) {
      const currentPercentageHealth = Math.max(0, (100 * this.health) / (this.health + this.shield));
      document.getElementById("health").style.width = `${currentPercentageHealth}%`;
      document.getElementById(
        "currentHealthHud"
      ).style.width = `${currentPercentageHealth}%`;

      document.getElementById("shield").style.width = `${100 - currentPercentageHealth}%`;
      document.getElementById(
        "currentShieldHud"
      ).style.width = `${100 - currentPercentageHealth}%`;
    }
    else {
      const currentPercentageHealth = Math.max(0, (100 * this.health) / this.maxHealth);
      const currentPercentageShield = Math.max(0, (100 * this.shield) / this.maxHealth);

      document.getElementById("health").style.width = `${currentPercentageHealth}%`;
      document.getElementById(
        "currentHealthHud"
      ).style.width = `${currentPercentageHealth}%`;

      document.getElementById("shield").style.width = `${currentPercentageShield}%`;
      document.getElementById(
        "currentShieldHud"
      ).style.width = `${currentPercentageShield}%`;
    }

    

    //render terrain
    document.querySelectorAll(".terrain").forEach((element) => {
      element.style.transform = `translate(${-(this.playerX%100)}px, ${-(this
        .playerY%100)}px)`;
    });

    //render abilities
    const abilities = document.getElementById("abilities").children;
    abilities[0].style.background = (this.q.cooldown == 1) ? "#100c0d88" : `conic-gradient(#100c0d88 0% ${
      100 * this.q.cooldown
    }%, #ff562200 0% 100%)`;
    abilities[1].style.background = (this.w.cooldown == 1) ? "#100c0d88" : `conic-gradient(#100c0d88 0% ${
      100 * this.w.cooldown
    }%, #ff562200 0% 100%)`;
    abilities[2].style.background = (this.e.cooldown == 1) ? "#100c0d88" : `conic-gradient(#100c0d88 0% ${
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

    this.actionsUse = { q: 0, w: 0, e: 0};

    return input;
  }

  setState(state) {
    this.playerX = state.playerX;
    this.playerY = state.playerY;
    this.maxHealth = state.maxHealth;
    this.health = state.health;
    this.shield = state.shield;
    this.q.setState(state.q)
    this.w.setState(state.w)
    this.e.setState(state.e)
  }
}

export { Player };
