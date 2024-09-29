const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "client.html"));
});

app.listen(3000, () => {
  console.log("Server running on port 3000 - http://localhost:3000/");
});

module.exports = app;