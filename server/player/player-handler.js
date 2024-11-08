const { Player } = require("./serverplayer.js");
function handlePlayer(ws, engine) {
  let player;

  ws.send(
    JSON.stringify({
      type: "init user",
    })
  );

  ws.on("message", (event) => {
    const message = JSON.parse(event);

    switch (message.type) {
      case "new user":
        player = new Player(engine, ws);
        ws.send(
          JSON.stringify({
            type: "new user",
            userID: player.id,
          })
        );
        break;

      case "reconnecting user":
        player = engine.playerGraveyard.get(message.userId);
        if (player) player.rejoin(ws);
        break;

      case "tick":
        player.setInput(message.input);
        break;
    }
  });

  ws.on("close", () => {
    if (player) player.delete();
  });
}

module.exports = handlePlayer;
