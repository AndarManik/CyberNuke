import { Player } from "./clientplayer.js";
import { OtherPlayer } from "./otherPlayer.js";

import { BasicMeleeAttackEntity } from "./abilities/basic-melee-attack.js";
import { BasicRangeAttackEntity } from "./abilities/basic-range-attack.js";
import { BasicShieldEntity } from "./abilities/basic-shield.js";
import { DamageIndicatorEntity } from "./damage-indicator.js";
import { PitRectangleEntity } from "./monsters/pit-rectanglec.js";
import { PitEntity } from "./monsters/pit.js";
import {
  A0Monster0Entity,
  A0Monster0EntityAbility,
} from "./monsters/a0-monster-0c.js";
import { A0Monster1Entity } from "./monsters/a0-monster-1c.js";
import { Drop } from "./abilities/drop.js";

const entities = {};
const otherPlayers = {};
const player = new Player();

let userId = "";
function setUserId(id) {
  userId = id;
}

function getUserId() {
  return userId;
}

let updating = false;
function updateState(message, socket) {
  socket.send(JSON.stringify({ type: "tick", input: player.getInput() }));

  if (updating) return;

  updating = true;
  message.players.forEach((playerData) => {
    if (playerData.id == userId) {
      player.setState(playerData);
      return;
    }

    if (otherPlayers[playerData.id] == null) {
      otherPlayers[playerData.id] = new OtherPlayer(player, playerData);
    }

    otherPlayers[playerData.id].setState(playerData);
  });

  message.entities.forEach((entityData) => {
    if (entities[entityData.id] == null) {
      switch (entityData.type) {
        case "basic range attack":
          entities[entityData.id] = new BasicRangeAttackEntity(entityData);
          break;
        case "basic melee attack":
          entities[entityData.id] = new BasicMeleeAttackEntity(entityData);
          break;
        case "basic shield":
          entities[entityData.id] = new BasicShieldEntity(entityData, player);
          break;
        case "damage indicator":
          entities[entityData.id] = new DamageIndicatorEntity(
            player,
            entityData,
            userId
          );
          break;
        case "a0monster0":
          entities[entityData.id] = new A0Monster0Entity(player, entityData);
          break;
        case "a0monster0ability":
          entities[entityData.id] = new A0Monster0EntityAbility(
            player,
            entityData
          );
          break;
        case "a0monster1":
          entities[entityData.id] = new A0Monster1Entity(player, entityData);
          break;
        case "pit":
          entities[entityData.id] = new PitEntity(player, entityData);
          break;
        case "rectangle":
          entities[entityData.id] = new PitRectangleEntity(player, entityData);
          break;
        case "drop":
          entities[entityData.id] = new Drop(entityData);
          break;
      }
    }

    if (!entities[entityData.id]) {
      console.log(entityData);
    } else {
      entities[entityData.id].setState(entityData);
    }
  });

  //remove non existent players
  Object.keys(otherPlayers).forEach((key) => {
    if (
      !message.players.some((otherPlayer) => {
        return otherPlayer.id == key;
      })
    ) {
      otherPlayers[key].remove();
      delete otherPlayers[key];
    }
  });

  Object.keys(entities).forEach((key) => {
    if (
      !message.entities.some((entity) => {
        return entity.id == key;
      })
    ) {
      entities[key].remove();
      delete entities[key];
    }
  });

  //render
  requestAnimationFrame(() => {
    player.render();

    Object.entries(otherPlayers).forEach((entry) => {
      entry[1].render();
    });

    Object.entries(entities).forEach((entry) => {
      entry[1].render();
    });
  });
  updating = false;
}

export { entities, otherPlayers, player, getUserId, setUserId, updateState };
