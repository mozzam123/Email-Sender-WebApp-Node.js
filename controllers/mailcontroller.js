const multer = require("multer");
const path = require("path");


exports.sendMail = (req, res) => {
  console.log(req.body.sender);
};

exports.getHomePage = (req, res) => {
  res.render("home");
};
