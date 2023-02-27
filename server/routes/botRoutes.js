const express = require("express");
const router = express.Router();
const {
  bots,
  botAdd,
  botEdit,
  botMenuEdit,
  botInfo,
  botMenu,
  botDelete,
  iconImg,
  botAttrEdit,
  uploadWidgetItem,
} = require("../controllers/botController");
const { userAuth } = require("../middlewares/auth");
const { botIcon } = require("../middlewares/multer");
const { asyncTryCatch } = require("../middlewares/async");

router.get("/", userAuth, asyncTryCatch(bots));
router.post("/add", userAuth, botIcon, asyncTryCatch(botAdd));
router.put("/edit", userAuth, botIcon, asyncTryCatch(botEdit));
router.post("/upload/:type/:botId", userAuth, asyncTryCatch(uploadWidgetItem));
router.put("/menu/edit", userAuth, asyncTryCatch(botMenuEdit));
router.put("/attribute/edit", userAuth, asyncTryCatch(botAttrEdit));
router.get("/info/:id", userAuth, asyncTryCatch(botInfo));
router.get("/menu/:id", userAuth, asyncTryCatch(botMenu));
router.delete("/delete/:botId", userAuth, asyncTryCatch(botDelete));
router.get("/icon/:name", asyncTryCatch(iconImg));
router.use("/widget", express.static("img/widget"));

module.exports = router;
