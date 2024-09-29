Map.prototype.map = function (consumer) {
  const output = [];
  this.forEach((value) => {
    output.push(consumer(value));
  });
  return output;
};

class EntityManager {
  constructor(engine) {
    engine.players = new Map();
    engine.playerGraveyard = new Map();
    engine.static = new Map();
    engine.dynamic = new Map();
    engine.monsters = new Map();
    engine.targetable = new Map();
    engine.global = new Map();
    engine.all = new Map();

    this.players = engine.players;
    this.global = engine.global;
    this.dynamic = engine.dynamic;
  }

  update() {
    const playerState = this.players.map((player) => player.getState());
    const globalData = this.global.map((global) => global.getState());
    this.players.forEach((player) =>
      player.sendPlayerTick(playerState, globalData)
    );
    this.dynamic.forEach((entity) => entity.update());
  }
}

module.exports = EntityManager;
