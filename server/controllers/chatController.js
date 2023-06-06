const { insert, find } = require("../config/db");
const response = require("../models/response");

exports.newChat = async (data) => {
  try {
    const r = await insert("chats", data);
  } catch (err) {
    console.log(err);
  }
};

exports.chats = async (req, res) => {
  const { botId, userId } = req.params;
  const data = await find(
    "chats",
    {
      botId,
      userId,
    },
    "userId agentId type message fromUser createdAt"
  );

  const resp = await response.findOne({ botId, userId }).select("values");

  res
    .status(200)
    .json({ success: true, data, attributesData: resp?.values || {} });
};
