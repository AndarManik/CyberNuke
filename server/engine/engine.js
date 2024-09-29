const Event = require("./event.js");
const Map = require("../map/map.js");
const Entity = require("./entity.js");
const values = require("./values.js");
const TickManager = require("./tick.js");
const EntityManager = require("./entity-manager.js");

class Engine {
  constructor() {
    this.values = values;
    this.tickManager = new TickManager();
    this.entityManager = new EntityManager(this);
    this.map = new Map(this);
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
        this.entityManager.update();
        this.tickManager.incrementTick();
      }
      setImmediate(update);
    }
    setImmediate(update);
  }
}

module.exports = Engine;
