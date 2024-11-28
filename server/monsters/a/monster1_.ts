import DamageIndicatorEntity from "../../damage-indicator";
import pointUtils from "../../point-utils";

import Engine from "../../engine/engine";
import { Targetable } from "../../engine/entity";
import Event from "../../engine/event";
import { ColorSuite } from "../../engine/values";
import Direction from "../../entity-components/direction";
import Health from "../../entity-components/health";
import Path from "../../entity-components/path";
import Position from "../../entity-components/position";
import Radius from "../../entity-components/radius";
import Target from "../../entity-components/target";
import Pit from "../../map/pit";

class AMonster1 implements Targetable{
  id: string;
  engine: Engine;
  pit: Pit;
  range: number;
  health: Health;
  position: Position;
  radius: Radius;
  path: Path;
  direction: Direction;
  target: Target;
  pathId: number;
  pathDevX: number;
  pathDevY: number;
  color: ColorSuite;
  damage: number;
  dashSpeed: number;
  behavior: () => void;
  walkingBackStarted: boolean;
  lastDash: Event;
  firstDash: boolean;
  alive: boolean;
  dashingStarted: boolean;
  playersHit: Map<string, Targetable> = new Map();
  distanceDashed: number;


  constructor(engine: Engine, pit: Pit, entityX: number, entityY: number, pathId: number) {
    this.engine = engine;

    this.engine.registerEntity(this).isTargetable(this);

    this.range = 250;

    this.pit = pit;
    this.health = new Health(engine, 500, 100)
    this.position = new Position(entityX, entityY);
    this.radius = new Radius(15);
    this.path = new Path(this.engine, this.position, 80, pit);
    this.direction = new Direction(this.engine, 8);
    this.target = new Target(
      this.position,
      this.radius,
      this.range,
      pit.playersInside
    );
    this.pathId = pathId;
    this.pathDevX = Math.cos(2.39 * pathId) * 3;
    this.pathDevY = Math.sin(2.39 * pathId) * 3;

    this.color = pit.color;

    this.damage = 50;
    this.dashSpeed = 400;

    this.behavior = this.walkingBack;
    this.walkingBackStarted = false;
    this.lastDash = this.engine.newEvent();
    this.firstDash = true;
    this.alive = true;
  }

  update() {
    //HECTIC: this behavior needs to include a vision check. Perhaps wait until the new pathing engine is done
    if (this.health.isZero()) {
      this.engine.removeEntity(this);
      this.alive = false;
    }
    this.behavior();

    this.path.isMoving = true;
    this.path.update();

    this.direction.update();

  }

  walkingBack() {
    if (this.pit.playersInside.length > 0) {
      this.walkingBackStarted = false;
      this.behavior = this.active;
      return;
    }

    if (this.position.isAtStart() && this.health.isFull()) {
      this.firstDash = true;
      this.direction.turnToStart()
      return;
    }

    if (!this.walkingBackStarted) {
      this.path.setPath(this.position.startX, this.position.startY);
      this.walkingBackStarted = true;
    }

    this.direction.turnTo(
      this.position.x,
      this.position.y,
      this.path.pathX[0],
      this.path.pathY[0]
    );

    if(this.position.isAtStart()) this.direction.turnToStart();

    this.health.update();
  }

  active() {
    const nearestPlayerData = this.target.nearest();
    const thereAreNoPlayers = nearestPlayerData === null;
    if(thereAreNoPlayers) {
      this.behavior = this.walkingBack;
      return;
    }
    const nearestPlayer = nearestPlayerData.entity;
    const playerDistance = nearestPlayerData.distance;

    const canShoot = this.lastDash.timeSince() > 4 || this.firstDash;
    const inDistance = playerDistance <= 30;

    if (
      canShoot &&
      inDistance &&
      !this.pit.isLineInTerrain(
        [this.position.x, this.position.y],
        [nearestPlayer.position.x, nearestPlayer.position.y]
      )
    ) {
      this.firstDash = false;
      this.behavior = this.dashing;
      return;
    }

    const engageDistance = canShoot ? 0 : 75;

    const xDif = this.position.x - nearestPlayer.position.x;
    const yDif = this.position.y - nearestPlayer.position.y;
    const distance = Math.sqrt(xDif * xDif + yDif * yDif);
    const preDestination: [number, number] = [
      (engageDistance * xDif) / distance +
        nearestPlayer.position.x +
        this.pathDevX,
      (engageDistance * yDif) / distance +
        nearestPlayer.position.y +
        this.pathDevY,
    ];

    const destination = this.pit.projectPointInto(preDestination);

    this.path.setPath(destination[0], destination[1]);
    this.direction.turnTo(
      this.position.x,
      this.position.y,
      this.path.pathX[0],
      this.path.pathY[0]
    );
  }

  dashing() {
    if (!this.dashingStarted) {
      this.lastDash.update();
      this.path.reset();
      this.playersHit = new Map();
      this.distanceDashed = 0;
      this.dashingStarted = true;
    }

    if (this.pit.playersInside.length == 0) {
      this.behavior = this.walkingBack;
      this.dashingStarted = false;
      return;
    }

    if (this.lastDash.timeSince() < 0.5) {
      const nearestPlayer = this.pit.getDistanceToPlayersInside([
        this.position.x,
        this.position.y,
      ])[0].player;

      this.direction.turnTo(
        this.position.x,
        this.position.y,
        nearestPlayer.position.x,
        nearestPlayer.position.y
      );
      return;
    }

    const distance = this.engine.getDelta() * this.dashSpeed;
    const targetPosition = this.direction.translate(
      [this.position.x, this.position.y],
      distance
    );
    const actualPosition = this.pit.projectPointInto(
      this.pit.kickOutTerrain(targetPosition)
    );
    this.position.x = actualPosition[0];
    this.position.y = actualPosition[1];

    this.distanceDashed += distance;

    if (this.pit.playersInside.length == 0) {
      this.behavior = this.walkingBack;
      this.dashingStarted = false;
    }

    this.pit.playersInside.forEach((player) => {
      if (
        !this.playersHit[player.id] &&
        pointUtils.distance(
          [this.position.x, this.position.y],
          [player.position.x, player.position.y]
        ) <=
          this.radius.current + player.radius.current
      ) {
        this.playersHit[player.id] = {};
        player.takeDamage(this.damage);
        new DamageIndicatorEntity(this.engine, this.damage, this.id, player.id);
      }
    });

    if (this.distanceDashed >= 120) {
      this.behavior = this.active;
      this.dashingStarted = false;
    }
  }

  getState() {
    return [
      {
        type: "a0monster1",
        entityX: this.position.x,
        entityY: this.position.y,
        id: this.id,
        bulletColor: this.color.weak.dark,
        bodyColor: this.color.weak.light,
        healthColor: this.color.health,
        maxHealth: this.health.max,
        health: this.health.current,
        direction: this.direction.current,
      },
    ];
  }

  takeDamage(amount: number) {
    this.health.takeDamage(amount);
  }
}

export default AMonster1;
