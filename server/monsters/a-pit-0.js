const pointUtils = require("../point-utils.js");
const { PitRectangleEntity } = require("./pit-rectangle.js");
const { v4: uuidv4 } = require("uuid");
const AMonster0 = require("./a/monster0_.js");
const AMonster1 = require("./a/monster1_.js");
const MeleeAttackDrop = require("../abilities/basic/melee-attack-drop.js");

const color = 210;

const terrainEntities = [];
const thin = Math.sqrt(0.5) * 25;
terrainEntities.push(new PitRectangleEntity(37.5, -50, 50, thin, color, 30));
terrainEntities.push(new PitRectangleEntity(37.5, 50, 50, thin, color, 150));
terrainEntities.push(new PitRectangleEntity(-37.5, -50, 50, thin, color, 150));
terrainEntities.push(new PitRectangleEntity(-37.5, 50, 50, thin, color, 30));
terrainEntities.push(new PitRectangleEntity(75, 0, thin, thin, color, 45));
terrainEntities.push(new PitRectangleEntity(-75, 0, thin, thin, color, 45));

const terrainPolygons = terrainEntities.map((ter) => ter.getGraph());
const pathData = pointUtils.buildPathingGraphFromPolygons(terrainPolygons);
const pathNodes = pathData[0];
const pathEdges = pathData[1];

function getPath(startPoint, endPoint, entityX, entityY) {
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

function kickOutTerrain(point, entityX, entityY) {
  const translatedPoint = [point[0] - entityX, point[1] - entityY];
  const kickedPoint = pointUtils.kickPointOutOfPolygons(
    translatedPoint,
    terrainPolygons
  );
  return [kickedPoint[0] + entityX, kickedPoint[1] + entityY];
}

function isLineInTerrain(start, end, entityX, entityY) {
  return pointUtils.isSegmentInPolygons(
    [start[0] - entityX, start[1] - entityY],
    [end[0] - entityX, end[1] - entityY],
    terrainPolygons
  );
}

class A0MonsterPitEntity {
  constructor(engine, entityX, entityY, color) {
    this.engine = engine;
    this.entity = this.engine.newEntity(this, "dynamic");
    this.entityX = entityX;
    this.entityY = entityY;
    this.radius = 125;
    const random = Math.random();
    this.color = engine.colors.blue;
    if(random > 0.20)
      this.color = engine.colors.green;
    if(random > 0.40)
      this.color = engine.colors.yellow;
    if(random > 0.60)
      this.color = engine.colors.red;
    if(random > 0.80)
      this.color = engine.colors.purple;
    
    this.color = color
    this.lastStateReadTick = 0;
    this.stateRead = [];
    this.playersInside = [];

    this.terrain = terrainEntities.map((terrain) => {
      const state = terrain.getState(entityX, entityY);
      state.color = this.color.terrain;
      return state;
    });

    this.entities = [];
    this.entities.push(
      new AMonster1(engine, this, this.entityX, this.entityY, 1)
    );
    this.entities.push(
      new AMonster1(engine, this, this.entityX + 25, this.entityY + 25, 2)
    );
    this.entities.push(
      new AMonster0(engine, this, this.entityX - 25, this.entityY + 25, 3)
    );

    this.entities.push(
      new AMonster0(engine, this, this.entityX + 25, this.entityY - 25, 4)
    );
    this.entities.push(
      new AMonster1(engine, this, this.entityX - 25, this.entityY - 25, 5)
    );

    this.entities.push(
      new AMonster0(engine, this, this.entityX - 25, this.entityY - 25, 6)
    );

    this.maxHealth = this.entities.reduce(
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
    this.entities.forEach((entity) => entity.update());
    this.removeDead();
    this.health = this.entities.reduce(
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
    for (let i = 0; i < this.entities.length; i++) {
      if (!this.entities[i].alive) {
        this.entities.splice(i, 1);
        i--; // decrement i to adjust index after splice
      }
    }
  }

  addPlayer(player) {
    this.playersInside.push(player);
  }

  removePlayer(player) {
    this.playersInside.splice(this.playersInside.indexOf(player), 1);
  }

  getPath(startPoint, endPoint) {
    return getPath(startPoint, endPoint, this.entityX, this.entityY);
  }

  kickOutTerrain(point) {
    return kickOutTerrain(point, this.entityX, this.entityY);
  }

  isLineInTerrain(start, end) {
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
      this.entities.forEach((entity) => {
        this.stateRead.push(...entity.getState());
      });
    }

    return this.stateRead;
  }

  isSegmentInPit(startPoint, endPoint) {
    return pointUtils.isSegmentIntersectingCircle(
      startPoint,
      endPoint,
      [this.entityX, this.entityY],
      this.radius
    );
  }

  getIntersectionSegment(startPoint, endPoint) {
    return pointUtils.getIntersectionSegmentCircle(
      startPoint,
      endPoint,
      [this.entityX, this.entityY],
      this.radius
    );
  }

  isPointInPit(point) {
    return pointUtils.isPointInCircle(
      point,
      [this.entityX, this.entityY],
      this.radius
    );
  }

  isCircleInPit(point, radius) {
    const distance = pointUtils.distance(point, [this.entityX, this.entityY]);
    return distance < this.radius + radius;
  }

  getDistanceToPlayersInside(point) {
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

  projectPointInto(point) {
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
