import pointUtils from "../point-utils";
import PitRectangleEntity from "./pit-rectangle";
import AMonster0 from "./a/monster0_";
import AMonster1 from "./a/monster1_";
import Monster from "./monster";
import Pit from "../map/pit";
import Engine from "../engine/engine";
import { ColorSuite } from "../engine/values";
import Player from "../player/serverplayer";
import AMonster2 from "./a/monster2_";
const MeleeAttackDrop = require("../abilities/basic/melee-attack-drop.js");

const terrainEntities: PitRectangleEntity[] = [];
const thin = Math.sqrt(0.5) * 25;
terrainEntities.push(new PitRectangleEntity(37.5, -50, 50, thin, 30));
terrainEntities.push(new PitRectangleEntity(37.5, 50, 50, thin, 150));
terrainEntities.push(new PitRectangleEntity(-37.5, -50, 50, thin, 150));
terrainEntities.push(new PitRectangleEntity(-37.5, 50, 50, thin, 30));
terrainEntities.push(new PitRectangleEntity(75, 0, thin, thin, 45));
terrainEntities.push(new PitRectangleEntity(-75, 0, thin, thin, 45));

const terrainPolygons = terrainEntities.map((ter) => ter.getGraph());
const pathData = pointUtils.buildPathingGraphFromPolygons(terrainPolygons);
const pathNodes = pathData[0];
const pathEdges = pathData[1];

function getPath(
  startPoint: [number, number],
  endPoint: [number, number],
  entityX: number,
  entityY: number
) {
  const translatedStartPoint = [
    startPoint[0] - entityX,
    startPoint[1] - entityY,
  ];
  const translatedEndPoint = [endPoint[0] - entityX, endPoint[1] - entityY];
  const path = pointUtils.getPath(
    translatedStartPoint,
    translatedEndPoint,
    pathNodes,
    pathEdges,
    terrainPolygons
  );
  path.x = path.x.map((x) => x + entityX);
  path.y = path.y.map((y) => y + entityY);
  return path;
}

function kickOutTerrain(
  point: [number, number],
  entityX: number,
  entityY: number
): [number, number] {
  const translatedPoint: [number, number] = [
    point[0] - entityX,
    point[1] - entityY,
  ];
  const kickedPoint = pointUtils.kickPointOutOfPolygons(
    translatedPoint,
    terrainPolygons
  );
  return [kickedPoint[0] + entityX, kickedPoint[1] + entityY];
}

function isLineInTerrain(
  start: [number, number],
  end: [number, number],
  entityX: number,
  entityY: number
) {
  return pointUtils.isSegmentInPolygons(
    [start[0] - entityX, start[1] - entityY],
    [end[0] - entityX, end[1] - entityY],
    terrainPolygons
  );
}

class A0MonsterPitEntity implements Pit {
  id: string;
  engine: Engine;
  entityX: number;
  entityY: number;
  radius: number;
  color: ColorSuite;
  lastStateReadTick: number;
  stateRead: object[];
  playersInside: Player[];
  terrain: object[];
  monsters: Monster[];
  maxHealth: number;
  health: number;
  isAlive: boolean;
  itemsDropped: boolean;
  state: object;

  constructor(
    engine: Engine,
    entityX: number,
    entityY: number,
    color: ColorSuite
  ) {
    this.engine = engine;
    this.engine.registerEntity(this).isDynamic(this);
    this.entityX = entityX;
    this.entityY = entityY;
    this.radius = 125;

    this.color = color;
    this.lastStateReadTick = 0;
    this.stateRead = [];
    this.playersInside = [];

    this.terrain = terrainEntities.map((terrain) =>
      terrain.getState(entityX, entityY, this.color.terrain)
    );

    this.monsters = [];
    this.monsters.push(
      new AMonster1(engine, this, this.entityX, this.entityY, 1)
    );
    this.monsters.push(
      new AMonster1(engine, this, this.entityX + 25, this.entityY + 25, 2)
    );
    this.monsters.push(
      new AMonster0(engine, this, this.entityX - 25, this.entityY + 25, 3)
    );

    this.monsters.push(
      new AMonster0(engine, this, this.entityX + 25, this.entityY - 25, 4)
    );
    this.monsters.push(
      new AMonster2(engine, this, this.entityX - 25, this.entityY - 25, 5)
    );

    this.maxHealth = this.monsters.reduce(
      (sum, entity) => sum + entity.health.max,
      0
    );
    this.health = this.maxHealth;
    this.isAlive = true;
    this.itemsDropped = false;

    this.state = {
      type: "pit",
      id: this.id,
      entityX: this.entityX,
      entityY: this.entityY,
      health: this.health,
      maxHealth: this.maxHealth,
      isAlive: this.isAlive,
      radius: this.radius,
      color: this.color.medium.medium,
    };
  }

  //MAYHEM: add dropping the items after the pit is finished.

  update() {
    this.monsters.forEach((entity) => entity.update());
    this.removeDead();
    this.health = this.monsters.reduce(
      (sum, entity) => sum + entity.health.current,
      0
    );

    if (this.health === 0) {
      this.isAlive = false;
      if (!this.itemsDropped) {
        console.log("MonsterPit items dropped");
        this.itemsDropped = true;
        this.dropItems();
      }
    }
  }

  dropItems() {
    new MeleeAttackDrop(this.engine, this.entityX, this.entityY);
  }

  removeDead() {
    for (let i = 0; i < this.monsters.length; i++) {
      if (!this.monsters[i].alive) {
        this.monsters.splice(i, 1);
        i--; // decrement i to adjust index after splice
      }
    }
  }

  addPlayer(player: Player) {
    this.playersInside.push(player);
  }

  removePlayer(player: Player) {
    this.playersInside.splice(this.playersInside.indexOf(player), 1);
  }

  getPath(startPoint: [number, number], endPoint: [number, number]) {
    return getPath(startPoint, endPoint, this.entityX, this.entityY);
  }

  kickOutTerrain(point: [number, number]) {
    return kickOutTerrain(point, this.entityX, this.entityY);
  }

  isLineInTerrain(start: [number, number], end: [number, number]) {
    return isLineInTerrain(start, end, this.entityX, this.entityY);
  }

  getState() {
    this.state.health = this.health;
    this.state.maxHealth = this.maxHealth;
    this.state.isAlive = this.isAlive;
    return this.state;
  }

  getEntitiesState() {
    if (this.lastStateReadTick != this.engine.tickManager.tick) {
      this.lastStateReadTick = this.engine.tickManager.tick;
      this.stateRead = [this.getState(), ...this.terrain];
      this.monsters.forEach((entity) => {
        this.stateRead.push(...entity.getState());
      });
    }

    return this.stateRead;
  }

  isSegmentInPit(startPoint: [number, number], endPoint: [number, number]) {
    return pointUtils.isSegmentIntersectingCircle(
      startPoint,
      endPoint,
      [this.entityX, this.entityY],
      this.radius
    );
  }

  getIntersectionSegment(
    startPoint: [number, number],
    endPoint: [number, number]
  ) {
    return pointUtils.getIntersectionSegmentCircle(
      startPoint,
      endPoint,
      [this.entityX, this.entityY],
      this.radius
    );
  }

  isPointInPit(point: [number, number]) {
    return pointUtils.isPointInCircle(
      point,
      [this.entityX, this.entityY],
      this.radius
    );
  }

  isCircleInPit(point: [number, number], radius: number) {
    const distance = pointUtils.distance(point, [this.entityX, this.entityY]);
    return distance < this.radius + radius;
  }

  getDistanceToPlayersInside(point: [number, number]) {
    return this.playersInside
      .map((player) => {
        return {
          player,
          distance: pointUtils.distance(point, [
            player.position.x,
            player.position.y,
          ]),
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }

  projectPointInto(point: [number, number]) {
    if (
      pointUtils.isPointInCircle(
        point,
        [this.entityX, this.entityY],
        this.radius
      )
    ) {
      return point;
    }

    return pointUtils.projectPointOntoCircle(
      point,
      [this.entityX, this.entityY],
      this.radius
    );
  }
}

module.exports = { A0MonsterPitEntity };
