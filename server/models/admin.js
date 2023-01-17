const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const admin = new Schema(
  {
    adminId: { type: Number, unique: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    picture: { type: String, required: true },
    forgotToken: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("admin", admin);
