const express = require("express");
const router = express.Router();
const { dashboardReport, report } = require("../controllers/reportController");
const { userAuth } = require("../middlewares/auth");
const { asyncTryCatch } = require("../middlewares/async");

router.get("/", userAuth, asyncTryCatch(dashboardReport));
router.post("/", userAuth, asyncTryCatch(report));

module.exports = router;
