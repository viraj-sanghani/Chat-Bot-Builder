const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const agents = new Schema(
  {
    agentId: { type: Number, unique: true },
    clientId: { type: Number },
    role: { type: String },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    isEmailverified: { type: Boolean, required: true, default: false },
    mobile: { type: String, required: true, default: null },
    isBlock: { type: Boolean, required: true, default: false },
    forgotToken: { type: String },
    picture: { type: String },
    gender: { type: String, default: "male" },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
agents.plugin(autoIncrement.plugin, {
  model: "agents",
  field: "agentId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("agents", agents);
