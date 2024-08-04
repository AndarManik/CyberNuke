const path = require("path");
const WebSocket = require("ws");
const express = require("express");

const { Player } = require("./serverplayer.js");
const {
  players,
  entities,
  playerGraveyard,
  globalEntities,
  incrementTick,
} = require("./state.js");
const { A0MonsterPitEntity } = require("./monsters/a0-monster-pit.js");

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

//routing code
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "client.html"));
});
app.listen(3000, () => {
  console.log("Server running on port 3000 - http://localhost:3000/");
});

//build level
const width = 5;
for (let x = -width; x <= width; x++) {
  for (let y = -width; y <= width; y++) {
    new A0MonsterPitEntity(x * 1000 - 200, y * 1000 - 200);
    new A0MonsterPitEntity(x * 1000 + 200, y * 1000 - 200);
    new A0MonsterPitEntity(x * 1000 - 200, y * 1000 + 200);
    new A0MonsterPitEntity(x * 1000 + 200, y * 1000 + 200);
  }
}

//client server interface
wss.on("connection", function connection(ws) {
  let player;
  ws.send(
    JSON.stringify({
      type: "init user",
    })
  );

  ws.on("message", function incoming(event) {
    const message = JSON.parse(event);
    switch (message.type) {
      case "new user":
        player = new Player(ws);
        ws.send(
          JSON.stringify({
            type: "new user",
            userID: player.id,
          })
        );
        break;
      case "reconnecting user":
        player = playerGraveyard[message.userId];
        if (player) player.rejoin(ws);
        // In the case where there is no player in the graveyard not setting the player will mean no messages from this websocket to the client, thus killing the client websocket.
        break;

      case "tick":
        player.setInput(message.input);
        break;
    }
  });

  ws.on("close", function close() {
    if (player) player.delete();
  });
});

server.listen(3001, () => {
  console.log("WebSocket server running on port 3001");
});

async function gameloop() {
  while (true) {
    const frametimer = new Promise((resolve) => setTimeout(resolve, 1000 / 60));
    //console.time("========server tick========");

    const playerData = Object.entries(players).map((entry) =>
      entry[1].getState()
    );

    const globalData = Object.entries(globalEntities).map((entry) =>
      entry[1].getState()
    );

    Object.entries(players).forEach((entry) => {
      entry[1].sendPlayerTick(playerData, globalData);
    });

    
    Object.entries(players).forEach((entry) => {
      entry[1].update();
    });
    
    Object.entries(entities).forEach((entry) => {
      entry[1].update();
    });

    incrementTick();
    //console.timeEnd("========server tick========");
    await frametimer;
  }
}

gameloop();
