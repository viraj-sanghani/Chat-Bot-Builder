const express = require("express");
const router = express.Router();
const { chats } = require("../controllers/chatController");
const { userAuth } = require("../middlewares/auth");
const { asyncTryCatch } = require("../middlewares/async");

router.get("/:botId/:userId", userAuth, asyncTryCatch(chats));

module.exports = router;
