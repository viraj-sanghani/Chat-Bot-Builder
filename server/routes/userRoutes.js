const express = require("express");
const router = express.Router();
const { users, userInfo } = require("../controllers/userController");
const { userAuth } = require("../middlewares/auth");
const { asyncTryCatch } = require("../middlewares/async");

router.get("/info/:userId", userAuth, asyncTryCatch(userInfo));
router.get("/:botId", userAuth, asyncTryCatch(users));

module.exports = router;
