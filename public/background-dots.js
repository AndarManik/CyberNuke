function buildDotBackground() {
  for (let index = 0; index < 40; index++) {
    for (let index2 = 0; index2 < 40; index2++) {
      const terrain = document.createElement("div");
      const spread = 1000;

      terrain.style.position = "absolute";

      terrain.classList.add("terrain");

      if (index % 4 == 0 && index2 % 4 == 0) {
        terrain.classList.add("terrain1");
        terrain.style.left = 350 - 2.5 + (index / 40) * spread - spread / 2;
        terrain.style.top = 350 - 2.5 + (index2 / 40) * spread - spread / 2;
      } else {
        terrain.classList.add("terrain2");
        terrain.style.left = 350 - 1.5 + (index / 40) * spread - spread / 2;
        terrain.style.top = 350 - 1.5 + (index2 / 40) * spread - spread / 2;
      }

      document.getElementById("background").append(terrain);
    }
  }
}

export { buildDotBackground };
