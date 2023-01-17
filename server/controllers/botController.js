const chatbots = require("../models/chatbots");
const chats = require("../models/chats");
const messages = require("../helpers/appConstants");
const fs = require("fs");
const { resizeImg } = require("../helpers/utils");
const ICON_DEST = "./img/icon/";
let PATH = __dirname.split("\\");
PATH.pop();
PATH = PATH.join("/");

exports.bots = async (req, res) => {
  const { clientId } = req;
  const data = [];
  const d = await chatbots
    .find({
      clientId,
    })
    .select("botId apiKey botName icon align background liveChat");

  for (let i = 0; i < d.length; i++) {
    const chat = await chats
      .findOne({
        botId: d[i].botId,
      })
      .sort({ chatId: -1 })
      .select("createdAt");

    data.push({
      botId: d[i].botId,
      liveChat: d[i].liveChat,
      botName: d[i].botName,
      icon: d[i].icon,
      align: d[i].align,
      background: d[i].background,
      apiKey: d[i].apiKey,
      lastUsed: chat?.createdAt || false,
    });
  }
  res.status(200).json({ success: true, data });
};

exports.botInfo = async (req, res) => {
  const { id } = req.params;

  const data = await chatbots
    .find({
      botId: id,
    })
    .select("botId botName icon align background liveChat");
  res.status(200).json({ success: true, data: data[0] || {} });
};

exports.botMenu = async (req, res) => {
  const { id } = req.params;

  const data = await chatbots
    .find({
      botId: id,
    })
    .select("menu");
  res.status(200).json({ success: true, data: data[0]?.menu || {} });
};

exports.iconImg = (req, res) => {
  const img = `${ICON_DEST}${req.params.name}`;
  if (fs.existsSync(img)) {
    res.sendFile(img, { root: "." });
  } else {
    res.sendFile(`${ICON_DEST}default.gif`, { root: "." });
  }
};

exports.botAdd = async (req, res) => {
  const { clientId } = req;

  if (req.file && req.file.path) {
    req.body["icon"] = req.file.filename;
  }

  const addBot = new chatbots(req.body);
  addBot.clientId = clientId;
  addBot.apiKey = (Math.random() + 1).toString(36).substring(2);
  try {
    await addBot.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: messages.serverError });
  }
};

exports.botEdit = (req, res) => {
  const botId = req.body?.botId;
  if (req.file && req.file.path) {
    req.body["icon"] = req.file.filename;
  }
  chatbots.findOneAndUpdate({ botId }, req.body).then(async () => {
    res.status(200).json({
      success: true,
      message: messages.botUpdate,
    });
  });
};

exports.botMenuEdit = (req, res) => {
  const botId = req.body?.botId;
  const menu = req.body?.menu;

  chatbots.findOneAndUpdate({ botId }, { menu }).then(async () => {
    res.status(200).json({
      success: true,
      message: messages.botUpdate,
    });
  });
};

exports.botDelete = async (req, res) => {
  const { botId } = req.params;
  await chatbots.deleteOne({ botId });
  res.status(200).json({ success: true });
};
