const botMenu = require("../../models/botMenu");
const message = require("../../helpers/appConstants");
const { readFileSync } = require("fs");
const { find, findOne } = require("./../../config/db");

exports.authBot = async (req, res) => {
  const { apiKey } = req.params;
  try {
    let bot = await findOne("bots", { apiKey });
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
    let bot = await findOne(
      "bots",
      { apiKey },
      "botId botName icon align background infoForm liveChat clientId"
    );
    if (!bot) return res.json({ success: false, message: "Invalid API Key" });

    let d = await botMenu
      .findOne({ botId: bot.botId })
      .select("menu attributes");
    let client = await findOne("clients", { clientId: bot.clientId }, "apiKey");

    if (!d?.menu) return res.json({ success: false, message: "Menu Not Set" });

    res.status(200).json({
      success: true,
      data: {
        bot: { ...bot, menu: d?.menu || [], attributes: d?.attributes || [] },
        apiKey: client.apiKey,
      },
    });
  } catch (err) {
    res.json({ success: false, message: message.serverError });
  }
};
