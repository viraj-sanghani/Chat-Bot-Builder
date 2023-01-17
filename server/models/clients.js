const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const clients = new Schema(
  {
    clientId: { type: Number, unique: true },
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    pinCode: { type: Number, required: true },
    city: { type: String, required: true },
    apiKey: { type: String, required: true },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
clients.plugin(autoIncrement.plugin, {
  model: "clients",
  field: "clientId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("clients", clients);
