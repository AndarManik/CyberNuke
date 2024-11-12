import * as http from "http";
import app from "./routes";
import WebSocket from "ws";
import Engine from "./engine/engine";

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const engine = new Engine();

engine.run();
wss.on("connection", engine.newPlayerSocket());
server.listen(3001, () => console.log("WebSocket server running on port 3001"));

// MAYHEM: Make the rest of the project us ts

console.log(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡶⠻⠛⠋⠛⠉⠉⠙⠓⠶⠦⣤⣀⡴⠷⠶⠦⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣶⣾⣿⣉⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣶⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣠⢾⢿⣶⡟⠀⠈⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠀⢨⣝⠲⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⡾⠛⠛⠋⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡞⣷⠀⠀⠀⠀
⠀⠀⠀⠀⣴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣙⣦⠀⠀⠀
⠀⠀⠀⣴⡿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡆⠀⠀
⠀⠀⠀⠻⣄⠚⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣠⡄⠀⣠⡄⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢳⡆⠀
⠀⠀⠀⠀⠈⢻⡞⢁⣀⠀⠀⠀⠀⠀⠀⠀⠀⠰⣿⣶⣿⣿⣷⣷⣿⣿⢿⣿⣷⣶⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡿⠃⠀
⠀⠀⠀⠀⠀⠀⠙⠲⢦⣤⣾⣿⣷⣶⣇⣠⣴⣾⣿⣿⠟⠉⠛⡇⠀⢸⡇⢀⣿⣿⣿⣟⣂⠀⠀⠀⢀⣀⣰⣾⣶⡾⠛⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠒⠿⠿⠿⢿⣿⣿⣿⣿⡂⠀⠀⠃⠀⠘⠀⢰⣿⣿⢿⣿⣿⣶⣦⣤⣤⢿⡿⠟⠋⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⢻⣿⠀⠀⠀⠀⠀⠀⢸⡿⣿⠿⠛⠛⠛⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣸⠉⠀⠀⠀⠀⢠⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢃⣸⣷⠀⠀⡆⣠⢸⣶⣘⣗⣶⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠴⠛⠋⠛⠋⠁⠙⠳⣤⡧⢿⠾⠛⠉⠁⠈⠙⠛⠳⢦⠤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⠋⠀⠀⠀⠀⠀⠀Cyber Nuke ⠀⠀⠀⠈⣿⣾⡧⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣦⣄⣤⣀⣀⣀⣶⠀⢀⣤⣤⣤⣤⣤⣤⣤⣤⡄⠀⣀⢀⣿⣿⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠿⢿⣿⣿⣿⠉⠹⠙⡏⠋⡏⠹⣟⡿⠿⠿⠟⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣀⠀⢀⣾⠀⢸⠀⡇⠀⡀⠀⢿⡇⣀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⠆⠹⠇⢀⣰⣿⠀⠘⡇⠃⠀⡇⠀⢸⣿⣦⣄⠀⢄⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠲⠾⠀⠀⣀⣦⣿⣇⡀⢰⠁⠀⠀⠃⠀⠸⣿⠿⠤⡀⠀⠙⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣤⣴⣾⣿⣷⣶⣦⣤⣴⡏⠉⣽⣿⠁⠐⠠⡄⠀⠀⠀⠀⢱⢧⠀⠹⣷⣴⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣂⣼⣿⣇⠀⠀⢠⣇⣴⡸⡄⢀⠈⢧⡳⣴⠏⢹⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀
⢀⣀⡴⠞⠙⠺⠟⣉⢽⡿⣿⣿⣿⣿⣿⣿⣍⣷⣾⡙⢶⠶⢾⣷⣤⣹⣿⣾⣷⣾⣿⣾⣾⣿⣿⣿⢿⡿⣿⣿⣷⣶⢀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠋⠰⣿⡾⠾⣿⣟⣿⡿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⠻⠯⢿⣿⢿⣦⠹⣿⣿⠻⣿⠆
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⠁⠀⠀⠀⠉⠋⠉⠛⠛⠋⠉⠉⠉⠁⠈⠀⠀⠀⠀⠀⠀⠉⠀⠉⠉⠉⠛⠀`);