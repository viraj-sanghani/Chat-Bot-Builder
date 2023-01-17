const rooms = require("../models/rooms");
const agents = require("../models/agents");
const chatbots = require("../models/chatbots");

exports.newRoom = async (data) => {
  try {
    const r = await new rooms(data).save();
    return {
      roomId: r.roomId,
      createdAt: r.createdAt,
      agentId: r.agentId,
    };
  } catch (err) {
    console.log(err);
  }
};

exports.rooms = async (req, res) => {
  const { clientId } = req;
  const bots = await chatbots.find({ clientId }).select("botId");
  const b = bots.map((e) => e.botId);
  const data = await rooms
    .find({ botId: { $in: b } })
    .sort({ roomId: -1 })
    .select("roomId botId botName userId agentId createdAt");

  res.status(200).json({ success: true, data });
};

exports.roomUpdate = async (data) => {
  try {
    const roomId = data?.roomId;
    await rooms.findOneAndUpdate({ roomId }, { agentId: data?.agentId });
    const room = await rooms.findOne({ roomId }).select("botId userId agentId");
    const agent = await agents
      .findOne({ agentId: data.agentId })
      .select("fullName picture");
    const d = {
      botId: room.botId,
      userId: room.userId,
      agentId: room.agentId,
      fullName: agent.fullName,
      picture: agent.picture,
    };

    return d;
  } catch (err) {
    console.log(err);
    return;
  }
};
