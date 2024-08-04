import { buildDotBackground } from "./background-dots.js";
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

buildDotBackground();

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

let clientStarted = false;

const entities = {};
const otherPlayers = {};
const player = new Player(otherPlayers);
let userID;

const serverTimeout = debounce(() => {
  if (clientStarted) {
    console.log("client restarted connection with server");
  } else {
    console.log("client started connection with server");
  }

  const socket = new WebSocket("wss://5r83l7fz-3001.use.devtunnels.ms/");
  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case "init user":
        if (clientStarted) {
          socket.send(
            JSON.stringify({ type: "reconnecting user", userId: userID })
          );
        } else {
          socket.send(JSON.stringify({ type: "new user" }));
        }
        break;

      case "new user":
        userID = message.userID;
        clientStarted = true;
        break;

      case "tick":
        serverTimeout();
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
                entities[entityData.id] = new DamageIndicatorEntity(
                  player,
                  entityData,
                  userID
                );
                break;
              case "a0monster0":
                entities[entityData.id] = new A0Monster0Entity(
                  player,
                  entityData
                );
                break;
              case "a0monster0ability":
                entities[entityData.id] = new A0Monster0EntityAbility(
                  player,
                  entityData
                );
                break;
              case "pit":
                entities[entityData.id] = new PitEntity(player, entityData);
                break;
              case "rectangle":
                entities[entityData.id] = new PitRectangleEntity(
                  player,
                  entityData
                );
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
}, 500);

serverTimeout();
