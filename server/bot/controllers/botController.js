const chatbots = require("../../models/chatbots");
const clients = require("../../models/clients");
const message = require("../../helpers/appConstants");
const { readFileSync } = require("fs");

exports.authBot = async (req, res) => {
  const { apiKey } = req.params;
  try {
    let bot = await chatbots.findOne({ apiKey });
    if (bot) {
      let file = readFileSync("bot/static/js/botAuth.js", "utf8");
      file = file.replace("ALIGN_TO", bot?.align || "right");
      res.send(file);
    } else {
      res.json({ success: false, message: "Invalid API Key" });
    }
  } catch (err) {
    res.json({ success: false, message: message.serverError });
  }
};

exports.botInfo = async (req, res) => {
  const { apiKey } = req.params;
  try {
    let bot = await chatbots
      .findOne({ apiKey })
      .select("botId botName icon align background menu liveChat clientId");
    let client = await clients
      .findOne({ clientId: bot.clientId })
      .select("apiKey");

    if (bot) {
      res
        .status(200)
        .json({ success: true, data: { bot, apiKey: client.apiKey } });
    } else {
      res.json({ success: false, message: "Invalid API Key" });
    }
  } catch (err) {
    res.json({ success: false, message: message.serverError });
  }
};
