const users = require("../models/users");
const chatbots = require("../models/chatbots");
const chats = require("../models/chats");
const rooms = require("../models/rooms");
const agents = require("../models/agents");
const moment = require("moment");

const getLivechat = (start, end, id) => {
  return new Promise(async (resolve) => {
    const chat = await rooms
      .find({
        createdAt: { $gte: start, $lt: end },
        botId: id,
      })
      .count();
    resolve(chat);
  });
};

const getUsers = (start, end, id) => {
  return new Promise(async (resolve) => {
    const u = await users
      .find({
        createdAt: { $gte: start, $lt: end },
        botId: id,
      })
      .count();
    resolve(u);
  });
};

const getAgents = (id) => {
  return new Promise(async (resolve) => {
    const data = await agents
      .find({
        clientId: id,
        role: { $not: { $eq: "Admin" } },
      })
      .select("fullName picture gender");
    resolve(data);
  });
};

const getLastUsed = (id) => {
  return new Promise(async (resolve) => {
    const chat = await chats
      .findOne({
        botId: id,
      })
      .sort({ chatId: -1 })
      .select("createdAt");
    resolve(
      chat?.createdAt ? moment(chat?.createdAt).format("lll") : "Not Used"
    );
  });
};

const getChats = async (id) => {
  return new Promise(async (resolve) => {
    const chat = await chats.aggregate([
      {
        $group: {
          agentId: { source: "$source", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    resolve(chat);
  });
};

const getWeekUsers = (start, end, id) => {
  return new Promise(async (resolve) => {
    const u = await users
      .find({
        createdAt: { $gte: start, $lt: end },
        clientId: id,
      })
      .count();
    resolve(u);
  });
};

exports.dashboardReport = async (req, res) => {
  const { clientId } = req;
  const start = moment()
    .add(-7, "days")
    .startOf("day")
    .format("YYYY-MM-DD HH:mm:ss");
  const end = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");

  const bots = await chatbots
    .find({
      clientId,
    })
    .select("botId botName");

  const data = {};
  data.agentsList = await getAgents(clientId);
  // data.chats = await getChats(clientId);
  data.weekUsers = {
    date: [],
    val: [],
  };

  for (let i = 6; i >= 0; i--) {
    const date = moment().add(-i, "days").format("Do MMM");
    const d = await getWeekUsers(
      moment().add(-i, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      moment().add(-i, "days").endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      clientId
    );
    data.weekUsers.date.push(date);
    data.weekUsers.val.push(d);
  }

  data.bots = bots.length;
  data.agents = data.agentsList.length;
  data.liveChat = 0;
  data.users = 0;

  for (let i = 0; i < bots.length; i++) {
    data.liveChat += await getLivechat(start, end, bots[i].botId);
    data.users += await getUsers(start, end, bots[i].botId);
  }

  res.status(200).json({ success: true, data });
};

exports.report = async (req, res) => {
  const { clientId } = req;
  const { start, end } = req.body;

  const bots = await chatbots
    .find({
      clientId,
    })
    .select("botId botName");

  const data = [];

  for (let i = 0; i < bots.length; i++) {
    const tmp = { name: bots[i].botName };
    tmp.users = await getUsers(start, end, bots[i].botId);
    tmp.liveChat = await getLivechat(start, end, bots[i].botId);
    tmp.lastUsed = await getLastUsed(bots[i].botId);
    data.push(tmp);
  }

  res.status(200).json({ success: true, data });
};
