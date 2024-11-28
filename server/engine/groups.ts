import Player from "../player/serverplayer";
import { Dynamic, Identified, Rendered, Targetable } from "./entity";
import { v4 as uuid } from "uuid";
// HECTIC: make the other parts use this

class Groups {
  players: Group<Player> = new Group();
  playerGraveyard: Group<Player> = new Group();
  dynamic: Group<Dynamic> = new Group();
  global: Group<Rendered> = new Group();
  targetable: Group<Targetable> = new Group();
  drops: Group<Identified> = new Group();
  all: Group<Identified> = new Group();

  new(entity: Identified) {
    entity.id = uuid();
    this.all.set(entity.id, entity);
    return this;
  }

  isPlayer(player: Player) {
    this.players.set(player.id, player);
    return this;
  }

  isPlayerGraveyard(player: Player) {
    this.playerGraveyard.set(player.id, player);
    return this;
  }

  isDynamic(dynamic: Dynamic) {
    this.dynamic.set(dynamic.id, dynamic);
    return this;
  }

  isGlobal(rendered: Rendered) {
    this.global.set(rendered.id, rendered);
    return this;
  }

  isTargetable(targeted: Targetable) {
    this.targetable.set(targeted.id, targeted);
    return this;
  }

  isDrop(identified: Identified) {
    this.drops.set(identified.id, identified);
    return this;
  }

  remove(entity: Identified) {
    this.players.delete(entity.id);
    this.playerGraveyard.delete(entity.id);
    this.dynamic.delete(entity.id);
    this.global.delete(entity.id);
    this.targetable.delete(entity.id);
    this.drops.delete(entity.id);
    return this;
  }

  delete(entity: Identified) {
    this.remove(entity);
    this.all.delete(entity.id);
  }
}

class Group<V> extends Map<string, V> {
  constructor(entries?: readonly (readonly [string, V])[] | null) {
    super(entries);
  }

  map<U>(callback: (value: V, key?: string, map?: Group<V>) => U): U[] {
    const result: U[] = [];

    if (callback.length === 1) {
      for (const value of this.values()) {
        result.push(callback(value));
      }
    } else if (callback.length === 2) {
      for (const [key, value] of this) {
        result.push(callback(value, key));
      }
    } else {
      for (const [key, value] of this) {
        result.push(callback(value, key, this));
      }
    }

    return result;
  }
}

export {Groups, Group};
