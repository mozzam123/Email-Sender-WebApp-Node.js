const express = require("express");
const router = express.Router();
const mailController = require("./../controllers/mailcontroller");

router.route("/send-email").post(mailController.sendMail);
router.route("/").get(mailController.getHomePage);

module.exports = router;
