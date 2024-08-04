const { DamageIndicatorEntity } = require("../damage-indicator.js");
const { entities, targetable, currentTick, players } = require("../state.js");
const { v4: uuidv4 } = require("uuid");
DamageIndicatorEntity;
class A0Monster0Entity {
  constructor(pit, entityX, entityY, pathId) {
    this.id = uuidv4();
    entities[this.id] = this;
    targetable[this.id] = this;

    this.pit = pit;
    this.startX = entityX;
    this.startY = entityY;
    this.entityX = entityX;
    this.entityY = entityY;

    this.color = pit.color;
    this.movespeed = 60 / 60;
    this.maxHealth = 300;
    this.health = 300;

    this.pathId = pathId;
    this.pathX = [];
    this.pathY = [];
    this.pathDevX = Math.cos(2.39 * pathId) * 10;
    this.pathDevY = Math.sin(2.39 * pathId) * 10;
    this.direction = 0;
    this.isShooting = false;
    this.state = "walking back";

    this.range = 100;
    this.bullet = null;
  }

  update() {
    if (this.health == 0) {
      delete entities[this.id];
      delete targetable[this.id];
    }
    switch (this.state) {
      case "walking back":
        this.walkingBack();
        break;
      case "active":
        this.active();
        break;
    }

    if (this.pathX == 0) return;

    let availableDistance = this.movespeed;

    while (availableDistance > 0 && this.pathX.length > 0) {
      const deltaX = this.pathX[0] - this.entityX;
      const deltaY = this.pathY[0] - this.entityY;
      const mag = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const moveDistanceX = (deltaX * availableDistance) / mag;
      const moveDistanceY = (deltaY * availableDistance) / mag;

      //if the desired position can be reached in one move
      if (mag <= availableDistance) {
        this.entityX = this.pathX.shift();
        this.entityY = this.pathY.shift();
        availableDistance -= mag;
      } else {
        this.entityX += moveDistanceX;
        this.entityY += moveDistanceY;
        availableDistance = 0;
      }
    }
  }

  walkingBack() {
    if (this.pit.playersInside.length > 0) {
      this.walkingBackPathSet = false;
      this.state = "active";
      return;
    }

    if (
      this.entityX == this.startX &&
      this.entityY == this.startY &&
      this.health == this.maxHealth
    ) {
      return;
    }

    if (!this.walkingBackPathSet) {
      const path = this.pit.getPath(
        [this.entityX, this.entityY],
        [this.startX, this.startY]
      );
      this.pathX = path.x;
      this.pathY = path.y;
      this.walkingBackPathSet = true;
    }

    this.direction = Math.atan2(
      this.pathX[0] - this.entityX,
      -1 * (this.pathY[0] - this.entityY)
    );

    this.health = Math.min(this.maxHealth, this.health + 100 / 60);
  }

  active() {
    if (this.pit.playersInside.length == 0) {
      this.activePathSet = false;
      this.state = "walking back";
      this.movespeed = 60 / 60;
      return;
    }
    if (!this.activePathSet) {
      this.activePathSetTick = currentTick();
      this.activePathSet = true;
    }

    const nearestPlayer = this.pit.getDistanceToPlayersInside([
      this.entityX,
      this.entityY,
    ])[0].player;

    const xDif = this.entityX - nearestPlayer.entityX;
    const yDif = this.entityY - nearestPlayer.entityY;
    const distance = Math.sqrt(xDif * xDif + yDif * yDif);
    const preDestination = [
      (this.range * xDif) / distance + nearestPlayer.entityX + this.pathDevX,
      (this.range * yDif) / distance + nearestPlayer.entityY + this.pathDevY,
    ];

    const destination = this.pit.projectPointInto(preDestination);
    const path = this.pit.getPath([this.entityX, this.entityY], destination);
    this.pathX = path.x;
    this.pathY = path.y;

    this.direction = Math.atan2(
      nearestPlayer.entityX - this.entityX,
      -1 * (nearestPlayer.entityY - this.entityY)
    );

    if (
      (currentTick() - this.activePathSetTick) % (2 * 60) ==
      this.pathId * 10 - 10
    ) {
      this.movespeed = 0;
    }

    if (
      (currentTick() - this.activePathSetTick) % (2 * 60) ==
      this.pathId * 10 + 20
    ) {
      this.movespeed = 60 / 60;
    }

    if (
      (currentTick() - this.activePathSetTick) % (2 * 60) ==
      this.pathId * 10
    ) {
      const nearestPlayerId = this.pit.getDistanceToPlayersInside([
        this.entityX,
        this.entityY,
      ])[0].player.id;

      this.bullet = new A0Monster0AbilityEntity(
        nearestPlayerId,
        this.entityX,
        this.entityY,
        this.pit.color,
        this
      );
    }
  }

  getState() {
    if (this.bullet) {
      return [
        {
          type: "a0monster0",
          entityX: this.entityX,
          entityY: this.entityY,
          id: this.id,
          color: this.color,
          maxHealth: this.maxHealth,
          health: this.health,
          direction: this.direction,
          isShooting: this.isShooting,
        },
        this.bullet.getState(),
      ];
    }
    return [
      {
        type: "a0monster0",
        entityX: this.entityX,
        entityY: this.entityY,
        id: this.id,
        color: this.color,
        maxHealth: this.maxHealth,
        health: this.health,
        direction: this.direction,
        isShooting: this.isShooting,
      },
    ];
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
  }
}

class A0Monster0AbilityEntity {
  constructor(receiverId, entityX, entityY, color, monster) {
    this.id = uuidv4();
    entities[this.id] = this;

    this.receiverId = receiverId;
    this.entityX = entityX;
    this.entityY = entityY;
    this.color = color;
    this.monster = monster;
    this.monster.isShooting = true;

    this.accel = 0.1;
    this.movespeed = 0.05;
    this.damage = 40;
  }

  update() {
    if (!(this.receiverId in players)) {
      delete entities[this.id];
      this.monster.isShooting = false;
      this.monster.bullet = null;
      return;
    }

    this.accel = Math.min(4, this.accel + 0.05);
    this.movespeed = Math.min(8, this.movespeed + this.accel);

    const dx = this.entityX - targetable[this.receiverId].entityX;
    const dy = this.entityY - targetable[this.receiverId].entityY;
    const distBetween = Math.sqrt(dx * dx + dy * dy);

    this.entityX -= (dx / distBetween) * this.movespeed;
    this.entityY -= (dy / distBetween) * this.movespeed;

    if (distBetween <= this.movespeed) {
      if (targetable[this.receiverId]) {
        targetable[this.receiverId].takeDamage(this.damage);
        new DamageIndicatorEntity(this.damage, this.id, this.receiverId);
      }
      delete entities[this.id];
      this.monster.isShooting = false;
      this.monster.bullet = null;
    }
  }

  getState() {
    return {
      type: "a0monster0ability",
      entityX: this.entityX,
      entityY: this.entityY,
      id: this.id,
      color: this.color,
    };
  }
}

module.exports = { A0Monster0Entity };
