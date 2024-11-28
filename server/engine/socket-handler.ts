import WebSocket from "ws";
import Engine from "./engine";
import Player from "../player/serverplayer";

const initString = JSON.stringify({ type: "init user" });

function handleSocket(engine: Engine, ws: WebSocket) {
  let player: Player;

  ws.send(initString);

  ws.on("message", (event) => {
    const message = JSON.parse(event.toString());

    switch (message.type) {
      case "tick":
        player.setInput(message.input);
        break;

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
        const undeadPlayer = engine.groups.playerGraveyard.get(message.userId);
        if (undeadPlayer) {
          player = undeadPlayer;
          player.rejoin(ws);
        }
        break;
    }
  });

  ws.on("close", () => {
    if (player) player.delete();
  });
}

export default handleSocket;
