const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("mozzam Inamdar");
});

app.listen(4500, () => {
  console.log("Server running");
});
