import Engine from "../../engine/engine";
import Event from "../../engine/event";
import Target from "../../entity-components/target";
import Player from "../../player/serverplayer";
import Ability from "../ability";
import RangeAttackEntity from "./range-attack-entity";

class RangeAttack implements Ability{
  engine: Engine;
  caster: Player;
  values: {
    cooldown: number;
    castRange: number;
    damage: number;
    movespeed: number;
  };
  target: Target;
  lastUse: Event;
  constructor(engine: Engine, caster: Player) {
    this.engine = engine;
    this.caster = caster;
    this.values = engine.values.abilities.basic.rangeAttack;

    this.target = new Target(
      this.caster.position,
      this.caster.radius,
      this.values.castRange,
      this.engine.groups.targetable
    );

    this.lastUse = this.engine.newEvent();
  }

  update() {}

  use() {
    if (this.lastUse.timeSince() < this.values.cooldown) return false;
    const trueMouseX = this.caster.position.x + this.caster.playerInput.mouseX;
    const trueMouseY = this.caster.position.y + this.caster.playerInput.mouseY;
    const targetedEntity = this.target.closestTo([trueMouseX, trueMouseY]);
    if (targetedEntity) {
      new RangeAttackEntity(this.engine, this.caster.id, targetedEntity.id);
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

export default RangeAttack;
