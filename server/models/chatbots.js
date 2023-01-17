const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const chatbots = new Schema(
  {
    botId: { type: Number, unique: true },
    clientId: { type: Number },
    apiKey: { type: String, required: true },
    botName: { type: String, required: true },
    icon: { type: String, default: "default.gif" },
    align: { type: String, required: true, default: "Right" },
    background: { type: String, required: true, default: "#FFF" },
    menu: {
      type: Array,
      default: [],
    },
    liveChat: { type: Boolean, default: false },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
chatbots.plugin(autoIncrement.plugin, {
  model: "chatbots",
  field: "botId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("chatbots", chatbots);
