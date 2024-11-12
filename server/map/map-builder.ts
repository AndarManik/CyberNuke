import Engine from "../engine/engine";
import World from "./world";
const { A0MonsterPitEntity } = require("../monsters/a-pit-0.js");

function buildMap(engine: Engine, world: World) {
  const width = 15;
  for (let x = -width; x <= width; x++) {
    for (let y = -width; y <= width; y++) {
      world.pits.push(
        new A0MonsterPitEntity(
          engine,
          x * 1000 - 200,
          y * 1000 - 200,
          engine.colors.blue
        )
      );
      world.pits.push(
        new A0MonsterPitEntity(
          engine,
          x * 1000 + 200,
          y * 1000 - 200,
          engine.colors.green
        )
      );
      world.pits.push(
        new A0MonsterPitEntity(
          engine,
          x * 1000 - 200,
          y * 1000 + 200,
          engine.colors.yellow
        )
      );
      world.pits.push(
        new A0MonsterPitEntity(
          engine,
          x * 1000 + 200,
          y * 1000 + 200,
          engine.colors.red
        )
      );
      world.pits.push(
        new A0MonsterPitEntity(engine, x * 1000, y * 1000, engine.colors.purple)
      );
    }
  }
}

export default buildMap;
