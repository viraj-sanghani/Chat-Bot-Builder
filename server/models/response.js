const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const response = new Schema(
  {
    botId: { type: Number, required: true },
    userId: { type: Number, required: true },
    resId: { type: Number, required: true },
    values: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("response", response);
