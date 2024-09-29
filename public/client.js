import { buildDotBackground } from "./background-dots.js";
import { setUserId, getUserId, updateState } from "./client-state.js";

buildDotBackground();

function restartOnLostConnection(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

let clientStarted = false;

const serverTimeout = restartOnLostConnection(() => {
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
            JSON.stringify({ type: "reconnecting user", userId: getUserId() })
          );
        } else {
          socket.send(JSON.stringify({ type: "new user" }));
        }
        break;

      case "new user":
        setUserId(message.userID);
        clientStarted = true;
        break;

      case "tick":
        serverTimeout();
        updateState(message, socket);
        break;
    }
  };
}, 500);

serverTimeout();
