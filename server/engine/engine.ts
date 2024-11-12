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

import Event from "./event";
import World from "../map/world";
import { Entity, Identified, Dynamic, Rendered, Targeted } from "./entity";
import { Values, Colors } from "./values";
import TickManager from "./tick";
import Player from "../player/serverplayer";
import WebSocket from "ws";
import { v4 as uuid } from "uuid";

class Engine {
  values: Values;
  colors: Colors;
  tickManager: TickManager;
  map: World;

  players: Map<string, Player> = new Map();
  playerGraveyard: Map<string, Player> = new Map();
  dynamic: Map<string, Dynamic> = new Map();
  global: Map<string, Rendered> = new Map();
  targetable: Map<string, Targeted> = new Map();
  drops: Map<string, Identified> = new Map();
  all: Map<string, Identified> = new Map();

  constructor() {
    this.values = new Values();
    this.colors = this.values.colors;
    this.tickManager = new TickManager();
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

    for (let [, player] of this.players) {
      playerState.push(player.getState());
    }

    //MAYHEM: this shouldn't be as global there should be a look up object that gives the player itself the data to send this could become a precompute step so there doesn't have to be that many creation of objects. Look at how player gets the entities in the pit's state.
    const globalData: Object[] = [];
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

  getDelta() {
    return this.tickManager.delta;
  }

  newEvent() {
    return new Event(this.tickManager);
  }

  newEntity(entity: Identified, ...group: string[]) {
    return new Entity(entity, this, ...group);
  }

  newPlayerSocket() {
    let player: Player;
    const engine = this;

    return function scope(ws: WebSocket) {
      ws.send(
        JSON.stringify({
          type: "init user",
        })
      );

      ws.on("message", (event) => {
        const message = JSON.parse(event.toString());

        switch (message.type) {
          case "tick":
            player.setInput(message.input);
            break;

          case "new user":
            player = new Player(engine, ws);
            ws.send(
              JSON.stringify({
                type: "new user",
                userID: player.id,
              })
            );
            break;

          case "reconnecting user":
            const undeadPlayer = engine.playerGraveyard.get(message.userId);
            if (undeadPlayer) {
              player = undeadPlayer;
              player.rejoin(ws);
            }
            break;
        }
      });

      ws.on("close", () => {
        if (player) player.delete();
      });
    };
  }

  // CALM: make this a seperate class

  registerEntity(entity: Identified) {
    entity.id = uuid();
    this.all.set(entity.id, entity);
    return this;
  }

  registerPlayer(player: Player) {
    this.players.set(player.id, player);
    return this;
  }

  registerTargeted(targeted: Targeted) {
    this.targetable.set(targeted.id, targeted);
    return this;
  }

  registerDynamic(dynamic: Dynamic) {
    this.dynamic.set(dynamic.id, dynamic);
    return this;
  }

  registerPlayerGraveyard(player: Player) {
    this.playerGraveyard.set(player.id, player);
    return this;
  }

  removeGroups(entity: Identified) {
    this.players.delete(entity.id);
    this.playerGraveyard.delete(entity.id);
    this.dynamic.delete(entity.id);
    this.global.delete(entity.id);
    this.targetable.delete(entity.id);
    this.drops.delete(entity.id);

    return this;
  }

  removeEntity(entity: Identified) {
    this.removeGroups(entity);
    this.all.delete(entity.id);
  }
}

export default Engine;
