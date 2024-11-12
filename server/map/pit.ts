import Player from "../player/serverplayer";

interface Pit {
    addPlayer(player: Player): void;
    removePlayer(player: Player): void;
    getEntitiesState(): object[];
}

export default Pit;