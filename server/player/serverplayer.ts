import Event from "../engine/event";
import Engine from "../engine/engine";
import { PlayerValues } from "../engine/values";
import { Dynamic, Targetable } from "../engine/entity";

import Path from "../entity-components/path";
import Radius from "../entity-components/radius";
import Health from "../entity-components/health";
import Shield from "../entity-components/shield";
import Position from "../entity-components/position";

import Pit from "../map/pit";

import { NetworkInput, PlayerInput } from "./input";
import WebSocket from "ws";

import Ability from "../abilities/ability";
import RangeAttack from "../abilities/basic/range-attack";
import MeleeAttack from "../abilities/basic/melee-attack";
import SelfShield from "../abilities/basic/self_shield";

class Player implements Targetable, Dynamic {
  id: string;
  engine: Engine;
  ws: WebSocket;

  position: Position;
  radius: Radius;
  path: Path;
  health: Health;
  shield: Shield;

  playerInput: PlayerInput;
  abilities: {
    q: Ability;
    w: Ability;
    e: Ability;
  };

  currentPit: Pit | null;
  renderedPits: Pit[];
  playerHit: Event;
  values: PlayerValues;

  constructor(engine: Engine, ws: WebSocket) {
    this.engine = engine;
    this.engine
      .registerEntity(this)
      .isPlayer(this)
      .isDynamic(this)
      .isTargetable(this);

    this.values = engine.values.player;

    this.ws = ws;

    this.position = new Position(100, 100); //CALM: make the parameters for this construtor arguments
    this.radius = new Radius(this.values.radius);
    this.path = new Path(
      this.engine,
      this.position,
      this.values.movespeed,
      this.engine.map
    );
    this.health = new Health(this.engine, this.values.health, 0);
    this.shield = new Shield();
    // CALM: put these in a CLASS or interface or something mainly class

    this.playerInput = new PlayerInput();

    this.abilities = {
      q: new RangeAttack(engine, this),
      w: new MeleeAttack(engine, this),
      e: new SelfShield(engine, this),
    };

    this.currentPit = null;
    this.renderedPits = [];

    this.playerHit = this.engine.newEvent();
  }

  setInput(networkInput: NetworkInput) {
    this.playerInput.updateState(networkInput);

    if (!this.playerInput.prevMouseDown && this.playerInput.mouseDown)
      this.path.isMoving = true;

    if (this.playerInput.s) {
      this.path.isMoving = false;
    }
  }

  getState() {
    return {
      id: this.id,
      entityX: this.position.x,
      entityY: this.position.y,
      maxHealth: this.health.max,
      health: this.health.current,
      shield: this.shield.current,
      q: this.abilities.q.getState(),
      w: this.abilities.w.getState(),
      e: this.abilities.e.getState(),
    };
  }

  update() {
    if (this.health.current <= 0) this.reset();

    this.health.regen =
      this.health.max *
      (this.playerHit.timeSince() > 10
        ? this.values.outOfCombatRegen
        : this.values.baseRegen);

    if (this.path.isMoving && this.playerInput.mouseDown)
      this.path.setPath(
        this.position.x + this.playerInput.mouseX,
        this.position.y + this.playerInput.mouseY
      );

    if (this.playerInput.isQUsed()) this.abilities.q.use();
    if (this.playerInput.isWUsed()) this.abilities.w.use();
    if (this.playerInput.isEUsed()) this.abilities.e.use();

    // update current pit
    const pitCheck = this.engine.map.checkPitOnPoint(
      [this.position.x, this.position.y],
      this.radius.current
    );

    if (this.currentPit !== pitCheck) {
      if (this.currentPit) {
        this.currentPit.removePlayer(this);
      }
      if (pitCheck) {
        pitCheck.addPlayer(this);
      }
      this.currentPit = pitCheck;
    }

    this.renderedPits = this.engine.map.getRenderedPits([
      this.position.x,
      this.position.y,
    ]);

    this.health.update();
    this.path.update();
    this.abilities.q.update();
    this.abilities.w.update();
    this.abilities.e.update();
  }

  sendPlayerTick(players: object[], globalData: object[]) {
    const entities = [...globalData];
    for (let index = 0; index < this.renderedPits.length; index++)
      entities.push(...this.renderedPits[index].getEntitiesState());

    this.ws.send(
      JSON.stringify({
        type: "tick",
        players,
        entities,
      })
    );
  }

  reset() {
    this.health.reset();
    this.shield.reset();
    this.position.reset();
    this.path.reset();
  }

  takeDamage(amount: number) {
    const initialAmount = amount;
    amount = this.shield.takeDamage(amount);
    this.health.takeDamage(amount);
    if (amount > 0) this.playerHit.update();
    return { sheildDamage: initialAmount - amount, healthDamage: amount };
  }

  delete() {
    this.engine.clearGroups(this).isPlayerGraveyard(this);
    if (this.currentPit) this.currentPit.removePlayer(this);
  }

  rejoin(ws: WebSocket) {
    this.ws = ws;
    this.engine
      .clearGroups(this)
      .isPlayer(this)
      .isDynamic(this)
      .isTargetable(this);
    if (this.currentPit) this.currentPit.addPlayer(this);
  }
}

export default Player;
