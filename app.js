const express = require("express");
const app = express();
const path = require("path");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "/src/public")));

// Set view engine and template path
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

module.exports = app;
