const express = require("express");
const router = express.Router();
const {
  agent,
  agents,
  agentsList,
  profileImg,
  profileImg50,
  agentEdit,
  agentDelete,
} = require("../controllers/agentController");
const { userAuth } = require("../middlewares/auth");
const { profile } = require("../middlewares/multer");
const { asyncTryCatch } = require("../middlewares/async");

router.get("/", userAuth, asyncTryCatch(agents));
router.get("/list", userAuth, asyncTryCatch(agentsList));
router.get("/info/:agentId", userAuth, asyncTryCatch(agent));
router.get("/picture/:name", asyncTryCatch(profileImg));
router.get("/picture/50/:name", asyncTryCatch(profileImg50));
router.put("/edit", userAuth, profile, asyncTryCatch(agentEdit));
router.delete("/delete/:agentId", userAuth, asyncTryCatch(agentDelete));

module.exports = router;
