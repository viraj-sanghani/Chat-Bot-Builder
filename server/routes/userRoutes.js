const express = require("express");
const router = express.Router();
const { users } = require("../controllers/userController");
const { userAuth } = require("../middlewares/auth");
const { asyncTryCatch } = require("../middlewares/async");

router.get("/:botId", userAuth, asyncTryCatch(users));

module.exports = router;
