const { newChat } = require("../../controllers/chatController");
const { newRoom, roomUpdate } = require("../../controllers/roomController");
const { newUser } = require("../../controllers/userController");

let io;
let users = {};
let agents = {};
let rooms = {};

module.exports = class Socket {
  static init(server) {
    io = require("socket.io")(server, {
      cors: {
        origin: "*", // ["http://localhost:3000", "http://localhost:5500"],
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      socket.on("join", function (data) {
        socket.userId = data.userId;
        socket.isAgent = data.isAgent;
        if (data.isAgent) {
          socket.apiKey = data.apiKey;
          if (!agents[data.apiKey]) {
            agents[data.apiKey] = {};
          }
          if (!agents[data.apiKey][data.userId]) {
            agents[data.apiKey][data.userId] = [];
          }
          agents[data.apiKey][data.userId].push(socket.id);
        } else {
          socket.botId = data.botId;
          if (!users[data.botId]) {
            users[data.botId] = {};
          }
          if (!users[data.botId][data.userId]) {
            newUser({
              botId: data?.botId,
              userId: data?.userId,
              name: data?.name || null,
              email: data?.email || null,
              mobile: data?.mobile || null,
            });
            users[data.botId][data.userId] = [];
          }
          users[data.botId][data.userId].push(socket.id);
        }
      });
      socket.on("disconnect", function () {
        if (socket.isAgent === undefined) return;
        if (socket.isAgent) {
          const index = agents[socket.apiKey][socket.userId].indexOf(socket.id);
          if (index > -1) {
            agents[socket.apiKey][socket.userId].splice(index, 1);
            agents[socket.apiKey][socket.userId].length === 0 &&
              delete agents[socket.apiKey][socket.userId];
          }
        } else {
          const index = users[socket.botId][socket.userId].indexOf(socket.id);
          if (index > -1) {
            users[socket.botId][socket.userId].splice(index, 1);
            users[socket.botId][socket.userId].length === 0 &&
              delete users[socket.botId][socket.userId];
          }
        }
      });
      socket.on("initLiveChat", async (data) => {
        const room = await newRoom({
          botId: data?.botId,
          botName: data.botName,
          userId: data?.userId,
        });

        const agt = Array.prototype.concat.apply(
          [],
          agents[data.apiKey] && Object.keys(agents[data.apiKey]).length > 0
            ? Object.keys(agents[data.apiKey]).map((e) => {
                return agents[data.apiKey][e];
              })
            : []
        );

        io.to(agt).emit("initLiveChat", {
          botId: data.botId,
          botName: data.botName,
          userId: data.userId,
          ...room,
        });
      });
      socket.on("agentAccept", async (data) => {
        try {
          const d = await roomUpdate({
            agentId: data.agentId,
            roomId: data.roomId,
          });

          const user =
            users[d.botId][d.userId].length > 0 ? users[d.botId][d.userId] : [];

          rooms[data.roomId] = { agentId: data.agentId, userId: d.userId };

          io.to(user).emit("agentAllocated", d);
        } catch (err) {
          console.log(err);
        }
      });
      socket.on("newChat", (data) => {
        // const arr = users[data.botId][data.userId] || [];
        newChat({
          botId: data?.botId,
          userId: data?.userId,
          message: data?.mes,
          fromUser: data?.fromUser ? 1 : 0,
        });
        /* io.to(arr).emit("sendMessage", {
          mes: data.mes,
          sender: socket.id,
          fromUser: data?.fromUser,
        }); */
      });
      socket.on("liveChat", (data) => {
        // const arr = users[data.botId][data.userId] || [];

        newChat({
          botId: data?.botId,
          userId: data?.userId,
          agentId: data?.agentId,
          message: data?.mes,
          fromUser: data?.fromUser ? 1 : 0,
        });

        const arr = data?.fromUser
          ? agents[data.apiKey]
            ? agents[data.apiKey][data?.agentId] || false
            : false
          : users[data?.botId]
          ? users[data?.botId][data?.userId] || false
          : false;

        io.to(arr).emit("receiveMes", {
          mes: data.mes,
          sender: socket.id,
          fromUser: data?.fromUser,
        });
      });
    });
  }

  static async sendMessage() {}

  static async receiveMessage() {}
};
