import Engine from "../../engine/engine";
import Event from "../../engine/event";
import Target from "../../entity-components/target";
import Player from "../../player/serverplayer";
import Ability from "../ability";

import MeleeAttackEntity from "./melee-attack-entity";

class MeleeAttack implements Ability{
  engine: Engine;
  caster: Player;
  values: {
    cooldown: number;
    castRange: number;
    damage: number;
    timeToHit: number;
  };
  lastUse: Event;
  target: Target;
  constructor(engine: Engine, caster: Player) {
    this.engine = engine;
    this.caster = caster;
    this.values = engine.values.abilities.basic.meleeAttack;

    this.lastUse = this.engine.newEvent();

    this.target = new Target(
      this.caster.position,
      this.caster.radius,
      this.values.castRange,
      this.engine.groups.targetable
    );
  }

  update() {}

  use() {
    if (this.lastUse.timeSince() < this.values.cooldown) return false;

    const targetedEntity = this.target.closestTo([
      this.caster.position.x + this.caster.playerInput.mouseX,
      this.caster.position.y + this.caster.playerInput.mouseY,
    ]);

    if (targetedEntity) {
      new MeleeAttackEntity(this.engine, this.caster.id, targetedEntity.id);
      this.lastUse.update();
      return true;
    }
    return false;
  }

  getState() {
    return {
      cooldown: Math.min(1, this.lastUse.timeSince() / this.values.cooldown),
      castRange: this.values.castRange,
    };
  }
}

export default MeleeAttack;
