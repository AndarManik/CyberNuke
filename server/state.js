const players = {};
const entities = {};
const targetable = {};
const static = {};
const playerGraveyard = {};
const globalEntities = {};

let tickCounter = 0;

function currentTick() {
  return tickCounter;
}

function incrementTick() {
  tickCounter++;
}

module.exports = { players, entities, targetable, static, playerGraveyard, globalEntities, currentTick, incrementTick };
