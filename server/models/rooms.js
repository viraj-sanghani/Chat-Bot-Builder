const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const rooms = new Schema(
  {
    roomId: { type: Number, unique: true },
    botId: { type: Number, required: true },
    botName: { type: String, required: true },
    userId: { type: Number, required: true },
    agentId: { type: Number, default: 0 },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
rooms.plugin(autoIncrement.plugin, {
  model: "rooms",
  field: "roomId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("rooms", rooms);
