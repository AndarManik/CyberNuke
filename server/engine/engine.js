// This code lets you do .map on Maps
// This has to be before the Map import
// MAYHEM: find all the places Maps are mapped through to change this function
Map.prototype.map = function (consumer) {
  const output = [];
  this.forEach((value) => {
    output.push(consumer(value));
  });
  return output;
};

const Event = require("./event.js");
const World = require("../map/world.js");
const Entity = require("./entity.js");
const values = require("./values.js");
const TickManager = require("./tick.js");

class Engine {
  constructor() {
    this.buildEntityGroups();
    this.values = values;
    this.tickManager = new TickManager();
    this.map = new World(this);
  }

  buildEntityGroups() {
    this.players = new Map();
    this.playerGraveyard = new Map();
    this.dynamic = new Map();
    this.monsters = new Map();
    this.targetable = new Map();
    this.global = new Map();
    this.drops = new Map();
    this.all = new Map();
  }
  
  getDelta() {
    return this.tickManager.delta;
  }

  newEvent() {
    return new Event(this.tickManager);
  }

  newEntity(entity, ...group) {
    return new Entity(entity, this, ...group);
  }

  run() {
    let lastTime = performance.now();
    const update = () => {
      const now = performance.now();
      if (now - lastTime >= 1000 / this.values.game.tick) {
        lastTime = now;
        this.updateEntities();
        this.tickManager.incrementTick();
      }
      setImmediate(update);
    };
    setImmediate(update);
  }

  updateEntities() {
    //MAYHEM: make this a look up (quad tree) to see what to render for the player
    const playerState = [];
    
    for (let [, player] of this.players) {
      playerState.push(player.getState());
    }
  
    //MAYHEM: this shouldn't be as global there should be a look up object that gives the player itself the data to send this could become a precompute step so there doesn't have to be that many creation of objects. Look at how player gets the entities in the pit's state.
    const globalData = [];
    for (let [, global] of this.global) {
      globalData.push(global.getState());
    }
  
    for (let [, player] of this.players) {
      player.sendPlayerTick(playerState, globalData);
    }
  
    for (let [, entity] of this.dynamic) {
      entity.update();
    }
  }
}

module.exports = Engine;
