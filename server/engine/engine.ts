import { Values, Colors } from "./values";
import TickManager from "./tick";
import Event from "./event";
import { Identified} from "./entity";
import {Groups} from "./groups";
import World from "../map/world";
import WebSocket from "ws";
import handleSocket from "./socket-handler";

class Engine {
  values: Values;
  colors: Colors;
  tickManager: TickManager;
  map: World;
  groups: Groups;

  constructor() {
    this.values = new Values();
    this.colors = this.values.colors;
    this.tickManager = new TickManager();
    this.groups = new Groups()
    this.map = new World(this);
  }

  run() {
    const tickLength = 1000 / this.values.game.tick;
    let misalignment = 0;
    let lastTime = performance.now();
    const update = () => {
      const now = performance.now();
      const alignedTick = tickLength - misalignment;
      if (now - lastTime >= alignedTick) {
        misalignment += now - lastTime - tickLength;
        lastTime = now;
        this.gametick();
      }
      setImmediate(update);
    };
    setImmediate(update);
  }

  gametick() {
    this.tickManager.incrementTick();

    //MAYHEM: make this a look up (quad tree) to see what to render for the player
    const playerState: Object[] = [];

    for (let [, player] of this.groups.players) {
      playerState.push(player.getState());
    }

    //MAYHEM: this shouldn't be as global there should be a look up object that gives the player itself the data to send this could become a precompute step so there doesn't have to be that many creation of objects. Look at how player gets the entities in the pit's state.
    const globalData: Object[] = [];
    for (let [, global] of this.groups.global) {
      globalData.push(global.getState());
    }

    for (let [, player] of this.groups.players) {
      player.sendPlayerTick(playerState, globalData);
    }

    for (let [, entity] of this.groups.dynamic) {
      entity.update();
    }
  }

  getDelta() {
    return this.tickManager.delta;
  }

  newEvent() {
    return new Event(this.tickManager);
  }

  registerEntity(entity: Identified) {
    this.groups.new(entity);
    return this.groups;
  }

  clearGroups(entity: Identified) {
    this.groups.remove(entity);
    return this.groups;
  }

  removeEntity(entity: Identified) {
    this.groups.delete(entity);
  }

  newPlayerSocket() {
    const engine = this;
    return function curry(ws: WebSocket) {
      return handleSocket(engine, ws);
    }
  }
}

export default Engine;
