import Position from "../entity-components/position";
import Radius from "../entity-components/radius";

interface Identified {
  id: string;
}

interface Targetable extends Identified {
  position: Position;
  radius: Radius;
  takeDamage(amount: number): void;
}

interface Dynamic extends Identified {
  update(): void;
}

interface Rendered extends Identified {
  getState(): object;
}

export { Identified, Dynamic, Rendered, Targetable };
