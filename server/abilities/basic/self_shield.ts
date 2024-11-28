import Engine from "../../engine/engine";
import Event from "../../engine/event";
import Player from "../../player/serverplayer";
import Ability from "../ability";

import ShieldEntity from "./self_shield_entity";
class SelfShield implements Ability{
  engine: Engine;
  caster: Player;
  cooldown: number;
  lastUse: Event;
  constructor(engine: Engine, caster: Player) {
    this.engine = engine;
    this.caster = caster;
    this.cooldown = 5;

    this.lastUse = this.engine.newEvent();
  }

  update() {}

  use() {
    if (this.lastUse.timeSince() < this.cooldown) return false;
    new ShieldEntity(this.engine, this.caster.id);
    this.lastUse.update();
    return true;
  }

  getState() {
    return {
      cooldown: Math.min(1, this.lastUse.timeSince() / this.cooldown),
    };
  }
}

export default SelfShield;
