const express = require("express");
const app = express();
const path = require("path");
const WebSocket = require("ws");
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const { v4: uuidv4 } = require("uuid");

const { players, entities } = require("./state.js");
const { Player } = require("./serverplayer.js");

const { A0MonsterPitEntity } = require("./monsters/a0-monster.js");

//routing code
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "client.html"));
});

app.listen(3000, () => {
  console.log("Server running on port 3000 - http://localhost:3000/");
});

//build level

new A0MonsterPitEntity(200, 200);

//websocket code

//client server interface
wss.on("connection", function connection(ws) {
  const userID = uuidv4();
  const newPlayer = new Player(userID, ws);
  players[userID] = newPlayer;

  ws.on("message", function incoming(event) {
    const message = JSON.parse(event);
    switch (message.type) {
      case "tick":
        newPlayer.setInput(message.input);
        break;
    }
  });

  ws.on("close", function close() {
    delete players[userID];
  });

  ws.send(JSON.stringify({ type: "init user", userID }));
});

server.listen(3001, () => {
  console.log("WebSocket server running on port 3001");
});

async function gameloop() {
  while (true) {
    const frametimer = new Promise((resolve) => setTimeout(resolve, 1000 / 60)); // Time for one tick at 60 ticks a seconds

    const playerData = Object.entries(players).map((entry) =>
      entry[1].getState()
    );

    const entityData = Object.entries(entities).map((entry) =>
      entry[1].getState()
    );

    const gameState = JSON.stringify({
      type: "tick",
      players: playerData,
      entities: entityData,
    });

    //tick message to client
    Object.entries(players).forEach((entry) => {
      entry[1].ws.send(gameState);
    });

    //server tick update code
    Object.entries(players).forEach((entry) => {
      entry[1].update();
    });

    Object.entries(entities).forEach((entry) => {
      entry[1].update();
    });

    await frametimer;
  }
}

gameloop();
