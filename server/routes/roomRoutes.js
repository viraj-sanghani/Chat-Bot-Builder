const express = require("express");
const router = express.Router();
const { rooms } = require("../controllers/roomController");
const { userAuth } = require("../middlewares/auth");
const { asyncTryCatch } = require("../middlewares/async");

router.get("/", userAuth, asyncTryCatch(rooms));
// router.put("/edit", userAuth, asyncTryCatch(roomUpdate));

module.exports = router;
