const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const routes = require("./routes");
const botRoutes = require("./bot");
const socket = require("./bot/controllers/socket");
const app = express();

const PORT = process.env.port || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const MONOGO_CONNECT_URL = process.env.MONGO_CONNECT_URL;
const mongoDbOptions = {
  useNewUrlParser: true,
};
const autoIncrement = require("mongoose-auto-increment");
mongoose.connect(MONOGO_CONNECT_URL, mongoDbOptions, (err) => {
  if (err) console.log(`Database not connected::::::=>${err}`);
  else console.log(`Database connected::: ${MONOGO_CONNECT_URL}`);
});
autoIncrement.initialize(mongoose.connection);

app.get("/", (req, res) => {
  res.send("Running");
});

app.use("/api", routes);
app.use("/bot", botRoutes);

const server = app.listen(PORT);
socket.init(server);
