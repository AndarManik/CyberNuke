import { Player } from "./clientplayer.js";
import { OtherPlayer } from "./otherPlayer.js";
import { BasicMeleeAttackEntity } from "./abilities/basic-melee-attack.js";
import { BasicRangeAttackEntity } from "./abilities/basic-range-attack.js";
import { BasicShieldEntity } from "./abilities/basic-shield.js";
import { DamageIndicatorEntity } from "./damage-indicator.js";
import { PitRectangleEntity } from "./monsters/pit-rectangle.js";
import { PitEntity } from "./monsters/pit.js";

//create background terrain
for (let index = 0; index < 40; index++) {
  for (let index2 = 0; index2 < 40; index2++) {
    const terrain = document.createElement("div");
    const spread = 1000;

    terrain.style.position = "absolute";

    terrain.classList.add("terrain");

    if (index % 4 == 0 && index2 % 4 == 0) {
      terrain.classList.add("terrain1");
      terrain.style.left = 350 - 2.5 + (index / 40) * spread - spread / 2;
      terrain.style.top = 350 - 2.5 + (index2 / 40) * spread - spread / 2;
    } else {
      terrain.classList.add("terrain2");
      terrain.style.left = 350 - 1.5 + (index / 40) * spread - spread / 2;
      terrain.style.top = 350 - 1.5 + (index2 / 40) * spread - spread / 2;
    }

    document.getElementById("background").append(terrain);
  }
}

const entities = {};
const otherPlayers = {};
const player = new Player(otherPlayers);
const socket = new WebSocket("wss://5r83l7fz-3001.use.devtunnels.ms/");
let userID;

socket.onmessage = function (event) {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case "init user":
      userID = message.userID;
      break;
    case "tick":
      message.players.forEach((playerData) => {
        if (playerData.id == userID) {
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
              entities[entityData.id] = new BasicRangeAttackEntity(
                player,
                entityData,
                otherPlayers,
                userID
              );
              break;
            case "basic melee attack":
              entities[entityData.id] = new BasicMeleeAttackEntity(
                player,
                entityData,
                otherPlayers,
                userID
              );
              break;
            case "basic shield":
              entities[entityData.id] = new BasicShieldEntity(
                entityData,
                player
              );
              break;
            case "damage indicator":
              if (
                entityData.caster == userID ||
                entityData.receiver == userID
              ) {
                entities[entityData.id] = new DamageIndicatorEntity(
                  player,
                  entityData,
                  userID
                );
              }
              break;
            case "pit rectangle":
              entities[entityData.id] = new PitRectangleEntity(
                player,
                entityData
              );
              break;
            case "pit":
              entities[entityData.id] = new PitEntity(player, entityData);
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
      //tick message to server
      socket.send(JSON.stringify({ type: "tick", input: player.getInput() }));
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
      break;
  }
};

socket.onopen = function (event) {};
