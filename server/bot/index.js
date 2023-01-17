const express = require("express");
const router = express.Router();
const { authBot, botInfo } = require("./controllers/botController");
const { staticFiles } = require("./controllers/staticController");

router.get("/auth/:apiKey", authBot);
router.get("/info/:apiKey", botInfo);
router.get("/static/icon/:file", (req, res) => staticFiles(req, res, "icon"));
router.get("/static/avatar/:file", (req, res) =>
  staticFiles(req, res, "avatar")
);
router.get("/static/img/:file", (req, res) => staticFiles(req, res, "img"));
router.get("/static/html/:file", (req, res) => staticFiles(req, res, "html"));
router.get("/static/css/:file", (req, res) => staticFiles(req, res, "css"));
router.get("/static/js/:file", (req, res) => staticFiles(req, res, "js"));
router.get("/static/audio/:file", (req, res) => staticFiles(req, res, "audio"));

module.exports = router;
