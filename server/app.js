const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./config/db");
const routes = require("./routes");
const botRoutes = require("./bot");
const socket = require("./bot/controllers/socket");
const app = express();

const PORT = process.env.port || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  // console.log(req.headers.origin);
  res.send("Running...");
});

app.use("/api", routes);
app.use("/bot", botRoutes);
// app.use("/widget", express.static(__dirname + "/img/widget"));

const server = app.listen(PORT, () => {
  console.log("🚀 - Server running on port :", PORT);
  return;
});
socket.init(server);
