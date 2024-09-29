const { A0MonsterPitEntity } = require("../monsters/a-pit-0.js");

function buildMap(engine, map) {
  const width = 15;
  for (let x = -width; x <= width; x++) {
    for (let y = -width; y <= width; y++) {
      map.pits.push(new A0MonsterPitEntity(engine, x * 1000 - 200, y * 1000 - 200));
      map.pits.push(new A0MonsterPitEntity(engine, x * 1000 + 200, y * 1000 - 200));
      map.pits.push(new A0MonsterPitEntity(engine, x * 1000 - 200, y * 1000 + 200));
      map.pits.push(new A0MonsterPitEntity(engine, x * 1000 + 200, y * 1000 + 200));
    }
  }
}

module.exports = buildMap;