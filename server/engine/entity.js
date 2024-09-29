const { v4: uuid } = require("uuid");

class Entity {
  constructor(entity, engine, ...groups) {
    this.entity = entity;
    this.engine = engine;
    this.groups = [];

    entity.id = uuid();
    this.engine.all.set(entity.id, entity);
    this.addGroup(...groups);
  }

  addGroup(...groups) {
    this.groups.push(...groups);
    groups.forEach((group) => this.engine[group].set(this.entity.id, this.entity));
    return this;
  }
  removeGroup(...groups) {
    this.groups.filter(group => !groups.includes(group));
    groups.forEach((group) => this.engine[group].delete(this.entity.id));
    return this;
  }

  remove() {
    this.groups.forEach(group => this.engine[group].delete(this.entity.id));
    this.engine.all.delete(this.entity.id);
  }
}

module.exports = Entity;