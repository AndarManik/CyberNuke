const app = require("./routes.js");
const WebSocket = require("ws");
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

const Engine = require("./engine/engine.js");
const handlePlayer = require("./player/player-handler.js");

const engine = new Engine();
engine.run();

wss.on("connection", (ws) => handlePlayer(ws, engine));

server.listen(3001, () => console.log("WebSocket server running on port 3001"));
