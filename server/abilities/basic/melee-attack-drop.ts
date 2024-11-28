import Engine from "../../engine/engine";
import {Rendered} from "../../engine/entity"
import Player from "../../player/serverplayer";

class MeleeAttackDrop implements Rendered {
  id: string;
  state: object;
  engine: Engine;

  constructor(engine: Engine, entityX: number, entityY: number) {
    this.engine = engine;
    engine.registerEntity(this).isGlobal(this).isDrop(this);
    this.state = {
      type: "drop",
      entityX: entityX,
      entityY: entityY,
      id: this.id,
    };
  }

  getState() {
    return this.state;
  }

  pickup(player: Player) {
    this.engine.removeEntity(this);
  }

  // HECTIC: make it so that when this is hovered in game the ability stats are shown
}

export default MeleeAttackDrop;