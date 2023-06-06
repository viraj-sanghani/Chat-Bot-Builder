const express = require("express");
const router = express.Router();

// router.use("/admin", require("./adminRouter"));
router.use("/auth", require("./authRoutes"));
router.use("/agent", require("./agentRoutes"));
router.use("/bot", require("./botRoutes"));
router.use("/chat", require("./chatRoutes"));
router.use("/user", require("./userRoutes"));
router.use("/room", require("./roomRoutes"));
router.use("/report", require("./reportRoutes"));
module.exports = router;
