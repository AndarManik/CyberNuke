const { Player } = require("./serverplayer.js");
class PlayerHandler {
  constructor(ws, engine) {
    ws.send(
      JSON.stringify({
        type: "init user",
      })
    );

    ws.on("message", (event) => {
      const message = JSON.parse(event);

      switch (message.type) {
        case "new user":
          this.player = new Player(engine, ws);
          ws.send(
            JSON.stringify({
              type: "new user",
              userID: this.player.id,
            })
          );
          break;

        case "reconnecting user":
          this.player = engine.playerGraveyard.get(message.userId);
          if (this.player) this.player.rejoin(ws);
          break;

        case "tick":
          this.player.setInput(message.input);
          break;
      }
    });

    ws.on("close", () => {
      if (this.player) this.player.delete();
    });
  }
}

module.exports = PlayerHandler;
