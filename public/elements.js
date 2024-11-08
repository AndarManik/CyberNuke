const gameWindow = document.getElementById("gameWindow");

// static is a faster way to render non moving entities because it saves a translate, potentially, since I don't know how the dom would render a translate with alot of elements on it
const staticEntities = document.getElementById("staticEntities");

export { gameWindow, staticEntities };
