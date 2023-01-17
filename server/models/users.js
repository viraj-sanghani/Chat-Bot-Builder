const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const users = new Schema(
  {
    userId: { type: Number, unique: true },
    name: { type: String, default: null },
    email: { type: String, lowercase: true, default: null },
    mobile: { type: String, default: null },
    isBlock: { type: Boolean, required: true, default: false },
    botId: { type: Number, required: true },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
module.exports = mongoose.model("users", users);
