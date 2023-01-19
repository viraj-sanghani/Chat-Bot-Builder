const { insert, find } = require("../config/db");

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
    "userId agentId message fromUser"
  );
  res.status(200).json({ success: true, data });
};
