const fs = require("fs");
const path = require("path");
const directoryPath = path.join(__dirname);
const modules = {};

fs.readdirSync(directoryPath).forEach((file) => {
  if (file !== "components.js") {
    const module = require(`./${file}`);
    Object.keys(module).forEach((key) => (modules[key] = module[key]));
  }
});

module.exports = modules;
