const botMenu = require("../models/botMenu");
const messages = require("../helpers/appConstants");
const {
  findOne,
  find,
  deleteOne,
  update,
  insert,
  db,
} = require("../config/db");
const { widgetItem } = require("../middlewares/multer");

const getLastBotUsed = async (botId) => {
  return new Promise((resolve) => {
    db.query(
      "SELECT createdAt FROM chats WHERE botId = ? ORDER BY chatId DESC LIMIT 1",
      [botId],
      (err, result) => {
        if (err) {
          resolve(false);
        } else {
          resolve(result.length > 0 ? result[0].createdAt : false);
        }
      }
    );
  });
};

exports.bots = async (req, res) => {
  const { clientId } = req;
  const data = [];
  const d = await find(
    "bots",
    {
      clientId,
    },
    "botId apiKey botName icon align background infoForm liveChat"
  );

  for (let i = 0; i < d.length; i++) {
    /* const chat = await findOne("chats", {
      botId: d[i].botId,
    })
      .sort({ chatId: -1 })
      .select("createdAt"); */

    const chat = await getLastBotUsed(d[i].botId);

    data.push({
      botId: d[i].botId,
      infoForm: d[i].infoForm,
      liveChat: d[i].liveChat,
      botName: d[i].botName,
      icon: d[i].icon,
      align: d[i].align,
      background: d[i].background,
      apiKey: d[i].apiKey,
      lastUsed: chat,
    });
  }
  res.status(200).json({ success: true, data });
};

exports.botInfo = async (req, res) => {
  const { id } = req.params;

  const data = await findOne(
    "bots",
    {
      botId: id,
    },
    "botId botName icon align background infoForm liveChat"
  );
  res.status(200).json({ success: true, data: data || {} });
};

exports.botMenu = async (req, res) => {
  const { id } = req.params;

  const data = await botMenu
    .find({
      botId: id,
    })
    .select("menu attributes");
  res.status(200).json({
    success: true,
    data: data[0]?.menu || {},
    attr: data[0].attributes,
  });
};

exports.botAdd = async (req, res) => {
  const { clientId } = req;

  if (req.file && req.file.path) {
    req.body["icon"] = req.file.filename;
  } else req.body["icon"] = "default.gif";

  const bot = req.body;
  bot.clientId = clientId;
  bot.apiKey = (Math.random() + 1).toString(36).substring(2);
  try {
    const id = await insert("bots", bot);
    const menu = new botMenu({
      botId: id,
    });
    menu.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: messages.serverError });
  }
};

exports.botEdit = async (req, res) => {
  const botId = req.body?.botId;
  if (req.file && req.file.path) {
    req.body["icon"] = req.file.filename;
  }
  await update("bots", { botId }, req.body);
  res.status(200).json({
    success: true,
    message: messages.botUpdate,
  });
};

exports.botMenuEdit = async (req, res) => {
  const botId = req.body?.botId;
  const menu = req.body?.menu;

  const bot = await botMenu.findOne(
    {
      botId,
    },
    "menu"
  );

  if (bot) await botMenu.findOneAndUpdate({ botId }, { menu });
  else {
    const newMenu = new botMenu({ botId, menu });
    newMenu.save();
  }

  res.status(200).json({
    success: true,
    message: messages.botUpdate,
  });
};

exports.botAttrEdit = async (req, res) => {
  const botId = req.body?.botId;
  const attributes = req.body?.attr;

  const update = await botMenu.findOneAndUpdate({ botId }, { attributes });

  res.status(200).json({
    success: true,
    message: messages.botUpdate,
  });
};

exports.uploadWidgetItem = async (req, res) => {
  widgetItem(req, res, (err) => {
    if (err) {
      res.status(400).send({ error: err?.message }).end();
      return;
    }

    const files = req.files.map((f) => {
      return {
        orgName: f.originalname,
        name: f.filename,
      };
    });

    res.status(200).json({ success: true, files });
  });
};

exports.botDelete = async (req, res) => {
  const { botId } = req.params;
  await deleteOne("bots", { botId });
  res.status(200).json({ success: true });
};
