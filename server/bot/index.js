const express = require("express");
const router = express.Router();
const { authBot, botInfo } = require("./controllers/botController");

router.get("/auth/:apiKey", authBot);
router.get("/info/:apiKey", botInfo);
router.use("/static", express.static("bot/static"));

module.exports = router;
