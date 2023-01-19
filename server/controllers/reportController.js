const moment = require("moment");
const { find } = require("../config/db");

const getLivechat = (start, end, id) => {
  return new Promise(async (resolve) => {
    const chat = /* await find("rooms",{
        createdAt: { $gte: start, $lt: end },
        botId: id,
      }) */ 5;

    resolve(chat);
  });
};

const getUsers = (start, end, id) => {
  return new Promise(async (resolve) => {
    const u = /* await users
      .find({
        createdAt: { $gte: start, $lt: end },
        botId: id,
      })
      .count(); */ 5;
    resolve(u);
  });
};

const getAgents = (id) => {
  return new Promise(async (resolve) => {
    const data = await find(
      "agents",
      {
        clientId: id,
        role: "User",
      },
      "fullName picture gender"
    );
    resolve(data);
  });
};

const getLastUsed = (id) => {
  return new Promise(async (resolve) => {
    /* const chat = await chats
      .findOne({
        botId: id,
      })
      .sort({ chatId: -1 })
      .select("createdAt");
    resolve(
      chat?.createdAt ? moment(chat?.createdAt).format("lll") : "Not Used"
    ); */
    resolve(moment().format("lll"));
  });
};

const getChats = async (id) => {
  return new Promise(async (resolve) => {
    const chat = /* await chats.aggregate([
      {
        $group: {
          agentId: { source: "$source", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]); */ 5;

    resolve(chat);
  });
};

const getWeekUsers = (start, end, id) => {
  return new Promise(async (resolve) => {
    const u = /* await users
      .find({
        createdAt: { $gte: start, $lt: end },
        clientId: id,
      })
      .count(); */ 5;
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

  const bots = await find(
    "bots",
    {
      clientId,
    },
    "botId botName"
  );

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

  const bots = await find(
    "bots",
    {
      clientId,
    },
    "botId botName"
  );

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
