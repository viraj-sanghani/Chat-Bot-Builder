const moment = require("moment");
const { find, db } = require("../config/db");

const execute = async (qry, ...data) => {
  return new Promise((resolve, reject) => {
    db.query(qry, data, (err, result) => (err ? reject(err) : resolve(result)));
  });
};

const getLivechat = (start, end, id) => {
  return new Promise(async (resolve) => {
    try {
      const chat = await execute(
        "SELECT count(roomId) as c FROM rooms WHERE botId = ? AND createdAt between ? and ?",
        id,
        start,
        end
      );
      resolve(chat[0].c);
    } catch (err) {
      resolve(0);
    }
  });
};

const getUsers = (start, end, id) => {
  return new Promise(async (resolve) => {
    try {
      const user = await execute(
        "SELECT count(userId) as c FROM users WHERE botId = ? AND createdAt between ? and ?",
        id,
        start,
        end
      );
      resolve(user[0].c);
    } catch (err) {
      resolve(0);
    }
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
    try {
      const res = await execute(
        "SELECT createdAt FROM chats WHERE botId = ? ORDER BY createdAt DESC LIMIT 1",
        id
      );
      resolve(res[0] ? res[0]?.createdAt : false);
    } catch (err) {
      resolve(false);
    }
  });
};

const getWeekUsers = (start, end, id) => {
  return new Promise(async (resolve) => {
    try {
      const res = await execute(
        "SELECT count(userId) as c FROM users WHERE clientId = ? AND createdAt between ? and ? ",
        id,
        start,
        end
      );
      resolve(res[0].c);
    } catch (err) {
      resolve(0);
    }
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
