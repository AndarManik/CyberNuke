import Engine from "../../engine/engine";
import Event from "../../engine/event";
import { ColorSuite } from "../../engine/values";
import Direction from "../../entity-components/direction";
import Health from "../../entity-components/health";
import Path from "../../entity-components/path";
import Position from "../../entity-components/position";
import Radius from "../../entity-components/radius";
import Target from "../../entity-components/target";
import Pit from "../../map/pit";
import Monster from "../monster";

class AMonster2 implements Monster {
  id: string;
  engine: Engine;
  pit: Pit;
  color: ColorSuite;
  health: Health;
  position: Position;
  radius: Radius;
  path: Path;
  pathDevX: number;
  pathDevY: number;
  direction: Direction;
  playerTarget: Target;
  monsterTarget: Target;
  lastHeal: Event;
  firstHeal: boolean = false;
  walkingBackStarted: boolean = false;
  healingStarted: boolean = false;
  healingGiven: boolean = false;
  alive: boolean = true;

  behavior: () => void;

  constructor(
    engine: Engine,
    pit: Pit,
    entityX: number,
    entityY: number,
    pathId: number
  ) {
    this.engine = engine;
    this.engine.registerEntity(this).isTargetable(this);

    this.pit = pit;
    this.color = pit.color;

    this.health = new Health(engine, 300, 100);
    this.position = new Position(entityX, entityY);
    this.radius = new Radius(150);
    this.path = new Path(this.engine, this.position, 150, pit);
    this.path.perpetual = true;
    this.direction = new Direction(this.engine, 8);

    this.pathDevX = Math.cos(2.39 * pathId) * 3;
    this.pathDevY = Math.sin(2.39 * pathId) * 3;

    this.playerTarget = new Target(
      this.position,
      this.radius,
      300,
      pit.playersInside
    );
    this.monsterTarget = new Target(
      this.position,
      this.radius,
      300,
      pit.monsters
    );

    this.lastHeal = engine.newEvent();

    this.behavior = this.walkingBack;
  }

  update(): void {
    this.removeIfDead();
    this.behavior();
    this.path.update();
    this.direction.update();
  }

  removeIfDead() {
    if (this.health.isZero()) {
      this.engine.removeEntity(this);
      this.alive = false;
    }
  }

  walkingBack() {
    const thereArePlayers = this.pit.playersInside.length > 0;
    if (thereArePlayers) {
      this.walkingBackStarted = false;
      this.behavior = this.active;
      return;
    }

    const monsterIsReset = this.position.isAtStart() && this.health.isFull();
    if (monsterIsReset) {
      this.firstHeal = true;
      this.direction.turnToStart();
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

    if (this.position.isAtStart()) this.direction.turnToStart();
    this.health.update();
  }

  active() {
    const nearestPlayerData = this.playerTarget.nearest();

    const thereAreNoPlayers = !nearestPlayerData;
    if (thereAreNoPlayers) {
      this.behavior = this.walkingBack;
      return;
    }

    const playerPosition = nearestPlayerData.entity.position;
    const nearestMonsterData = this.monsterTarget.farthestFrom([
      playerPosition.x,
      playerPosition.y,
    ]);

    const onlyMonsterLeft = !nearestMonsterData;

    if (onlyMonsterLeft) {
      const nearestPlayer = nearestPlayerData.entity;
      const engageDistance = 1000000; //some large number

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
      return;
    }

    const distanceToMonster = Math.sqrt(
      (this.position.x - nearestMonsterData.position.x) ** 2 +
        (this.position.y - nearestMonsterData.position.y) ** 2
    );

    const healAvailable = this.lastHeal.timeSince() > 3;

    if (healAvailable) {
      const inHealDistance = distanceToMonster <= 30;

      if (inHealDistance) {
        this.behavior = this.heal;
        return;
      }

      const monsterPosition = nearestMonsterData.position;

      this.path.setPath(monsterPosition.x, monsterPosition.y);
      this.direction.turnTo(
        this.position.x,
        this.position.y,
        this.path.pathX[0],
        this.path.pathY[0]
      );
      return;
    }

    // hide from player behind a monster

    const monsterPosition = nearestMonsterData.position;

    const playerToMonster = [
      monsterPosition.x - playerPosition.x,
      monsterPosition.y - playerPosition.y,
    ];

    const magnitude = Math.sqrt(
      playerToMonster[0] ** 2 + playerToMonster[1] ** 2
    );

    const preDestination: [number, number] = [
      (playerToMonster[0] * 100) / magnitude + monsterPosition.x + this.pathDevX,
      (playerToMonster[1] * 100) / magnitude + monsterPosition.y + this.pathDevY,
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

  heal() {
    if (!this.healingStarted) {
      this.lastHeal.update();
      this.path.movespeed = 0;
      this.healingStarted = true;
    }

    const thereAreNoPlayers = this.pit.playersInside.length == 0;
    if (thereAreNoPlayers) {
      this.path.movespeed = 150;
      this.behavior = this.walkingBack;
      this.healingStarted = false;
      return;
    }

    const finishedHealing = this.lastHeal.timeSince() > 0.75;
    if (finishedHealing) {
      this.path.movespeed = 150;
      this.behavior = this.active;
      this.healingStarted = false;
      this.healingGiven = false;
      return;
    }

    const nearestMonster = this.monsterTarget.nearest();

    if (!nearestMonster) {
      this.path.movespeed = 150;
      this.behavior = this.active;
      this.healingStarted = false;
      this.healingGiven = false;
      return;
    }

    const finishedCharging =
      this.lastHeal.timeSince() > 0.1 && !this.healingGiven;
    if (finishedCharging) {
      this.healingGiven = true;
    }

    this.direction.turnTo(
      this.position.x,
      this.position.y,
      nearestMonster.entity.position.x,
      nearestMonster.entity.position.y
    );
  }

  getState(): object[] {
    const state: object[] = [];
    state.push({
      type: "a0monster0",
      entityX: this.position.x,
      entityY: this.position.y,
      id: this.id,
      bulletColor: this.color.strong.dark,
      bodyColor: this.color.strong.light,
      healthColor: this.color.health,
      maxHealth: this.health.max,
      health: this.health.current,
      direction: this.direction.current,
    });
    return state;
  }

  takeDamage(amount: number) {
    this.health.takeDamage(amount);
  }
}

export default AMonster2;
