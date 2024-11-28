import { Targetable } from "../engine/entity";
import { ColorSuite } from "../engine/values";
import Monster from "../monsters/monster";
import Player from "../player/serverplayer";
import { PathFinder } from "./pathfinder";

interface Pit extends PathFinder {
  playersInside: Targetable[];
  monsters: Monster[];
  color: ColorSuite;

  addPlayer(player: Player): void;
  removePlayer(player: Player): void;
  getEntitiesState(): object[];
  projectPointInto(point: [number, number]): [number, number];
  getDistanceToPlayersInside(
    point: [number, number]
  ): { player: Player; distance: number }[];
  isLineInTerrain(start: [number, number], end: [number, number]): boolean;
  kickOutTerrain(point: [number,number]): [number, number];
}

export default Pit;
