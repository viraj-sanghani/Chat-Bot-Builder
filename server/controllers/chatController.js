const chats = require("../models/chats");

exports.newChat = async (data) => {
  try {
    const r = new chats(data).save();
  } catch (err) {
    console.log(err);
  }
};

exports.chats = async (req, res) => {
  const { botId, userId } = req.params;
  const data = await chats
    .find({
      botId,
      userId,
    })
    .select("userId agentId message fromUser");
  res.status(200).json({ success: true, data });
};
