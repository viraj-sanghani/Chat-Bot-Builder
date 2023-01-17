const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const chats = new Schema(
  {
    chatId: { type: Number, unique: true },
    botId: { type: Number, required: true },
    userId: { type: Number },
    agentId: { type: Number, default: 0 },
    message: { type: String, required: true },
    fromUser: { type: Boolean, required: true },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
chats.plugin(autoIncrement.plugin, {
  model: "chats",
  field: "chatId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("chats", chats);
