const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const botMenu = new Schema(
  {
    menuId: { type: Number, unique: true },
    botId: { type: Number, unique: true },
    menu: {
      type: Object,
      default: {
        key: 1,
        mes: "Hi",
        type: "text",
        next: null,
      },
    },
    attributes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
botMenu.plugin(autoIncrement.plugin, {
  model: "botMenu",
  field: "menuId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("botMenu", botMenu);
