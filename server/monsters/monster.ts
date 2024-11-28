import Health from "../entity-components/health";
import Position from "../entity-components/position";
import Radius from "../entity-components/radius";

interface Monster {
    id: string;
    health: Health;
    alive: boolean;
    position: Position;
    radius: Radius;
    takeDamage(amount: number): void;
    update(): void;
    getState(): object[];
}

export default Monster;