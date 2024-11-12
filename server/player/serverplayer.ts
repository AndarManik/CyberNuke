import { Dynamic, Targeted } from "../engine/entity";
import Engine from "../engine/engine";
import Position from "../entity-components/position";
import Radius from "../entity-components/radius";
import Path from "../entity-components/path";
import Health from "../entity-components/health";
import Shield from "../entity-components/shield";
import Ability from "../abilities/ability";
import Pit from "../map/pit";
import Event from "../engine/event";
import WebSocket from "ws";

const {
  RangeAttack,
  MeleeAttack,
  SelfShield,
} = require("../abilities/basic.js");

type Input = {
  mouseDown: boolean;
  mouseX: number;
  mouseY: number;
  actions: {
    s: any;
    q: number;
    w: number;
    e: number;
  };
  actionsUse: {
    q: any;
    w: any;
    e: any;
  };
};

class Player implements Targeted, Dynamic {
  id: string;
  engine: Engine;
  ws: WebSocket;
  position: Position;
  radius: Radius;
  path: Path;
  health: Health;
  shield: Shield;
  mouseX: number;
  mouseY: number;
  prevMouseDown: boolean;
  mouseDown: boolean;
  actions: {
    q: number;
    w: number;
    e: number;
    s: number;
  };
  actionsUse: {
    q: number;
    w: number;
    e: number;
    s: number;
  };
  abilities: {
    q: Ability;
    w: Ability;
    e: Ability;
  };
  currentPit: Pit | null;
  renderedPits: Pit[];
  playerHit: Event;

  constructor(engine: Engine, ws: WebSocket) {
    this.engine = engine;
    this.engine.registerEntity(this);
    this.engine.registerPlayer(this);
    this.engine.registerDynamic(this);
    this.engine.registerTargeted(this);

    this.ws = ws;

    this.position = new Position(100, 100);
    this.radius = new Radius(10);
    this.path = new Path(this.engine, this.position, 100, this.engine.map);
    this.health = new Health(this.engine, 1000, 0.01);
    this.shield = new Shield();
    // CALM: put these in a CLASS or interface or something mainly class
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseDown = false;
    this.mouseDown = false;

    this.actions = { q: 0, w: 0, e: 0, s: 0 };
    this.actionsUse = { q: 0, w: 0, e: 0, s: 0 };

    this.abilities = {
      q: new RangeAttack(engine, this),
      w: new MeleeAttack(engine, this),
      e: new SelfShield(engine, this),
    }; //contains upto 3 abilities at members q,w,e

    this.currentPit = null;
    this.renderedPits = [];

    this.playerHit = this.engine.newEvent();
  }

  setInput(input: Input) {
    this.prevMouseDown = this.mouseDown;
    this.mouseDown = input.mouseDown;
    this.mouseX = input.mouseX;
    this.mouseY = input.mouseY;

    this.actions = input.actions;
    this.actionsUse.q = input.actionsUse.q ? 1 : this.actionsUse.q;
    this.actionsUse.w = input.actionsUse.w ? 1 : this.actionsUse.w;
    this.actionsUse.e = input.actionsUse.e ? 1 : this.actionsUse.e;

    if (this.prevMouseDown && this.mouseDown) this.path.isMoving = true;

    if (input.actions.s) {
      this.path.isMoving = false;
      this.actionsUse.q = 0;
      this.actionsUse.w = 0;
      this.actionsUse.e = 0;
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
      this.health.max * (this.playerHit.timeSince() > 10 ? 0.1 : 0.01);

    this.health.update();

    if (this.path.isMoving && this.mouseDown)
      this.path.setPath(
        this.position.x + this.mouseX,
        this.position.y + this.mouseY
      );

    this.path.update();

    //ability update
    ["q", "w", "e"].forEach((key) => {
      if (this.actionsUse[key] && !this.actions.s) {
        this.abilities[key].use();
        this.actionsUse[key] = 0;
      }
    });

    ["q", "w", "e"].forEach((key) => {
      this.abilities[key].update();
    });

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
    this.engine.removeGroups(this).registerPlayerGraveyard(this);
    if (this.currentPit) this.currentPit.removePlayer(this);
  }

  rejoin(ws: WebSocket) {
    this.ws = ws;
    this.engine.removeGroups(this);
    this.engine.registerPlayer(this);
    this.engine.registerDynamic(this);
    this.engine.registerTargeted(this);
    if (this.currentPit) this.currentPit.addPlayer(this);
  }
}

export default Player;
