const { insert, findOne, find, update, db } = require("../config/db");

exports.newRoom = async (data) => {
  try {
    const roomId = await insert("rooms", data);
    const r = await findOne("rooms", { roomId });
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
  const bots = await find("bots", { clientId }, "botId");
  const b = bots ? bots.map((e) => e.botId) : [];
  /* const data = await find("rooms",{ botId: { $in: b } })
    .sort({ roomId: -1 })
    .select("roomId botId botName userId agentId createdAt");  */

  const data = db.query(
    "SELECT roomId, botId, botName, userId, agentId, createdAt FROM rooms WHERE botId in(?) ORDER BY roomId DESC",
    [b],
    (err, result) => {
      if (err) {
        res.status(200).json({ success: false });
      } else {
        res.status(200).json({ success: true, data: result });
      }
    }
  );
};

exports.roomUpdate = async (data) => {
  try {
    const roomId = data?.roomId;
    await update("rooms", { roomId }, { agentId: data?.agentId });
    const room = await findOne("rooms", { roomId }, "botId userId agentId");
    const agent = await findOne(
      "agents",
      { agentId: data.agentId },
      "fullName picture"
    );
    const d = {
      botId: room.botId,
      roomId: roomId,
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
