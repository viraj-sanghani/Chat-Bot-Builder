import { createSlice, current } from "@reduxjs/toolkit";
import { getFile } from "../../Utils/files";
import { io } from "socket.io-client";
import moment from "moment";
const SEND_AUDIO = new Audio(getFile("audio", "send-message.mp3"));
const RECEIVE_AUDIO = new Audio(getFile("audio", "receive-message.mp3"));

const initialState = {
  isOpen: false,
  isMute: true,
  infoData: {},
  isInitChat: false,
  liveChatEnabled: false,
  agent: {},
  isChatLoading: false,
  chats: [],
  menu: {},
  curMenu: {},
  botDetails: {},
  attributes: [],
  showGalleryModel: false,
  galleryData: { data: [], slide: 0 },
  socket: null,
  attributesData: {},
  localData: null,
};

export const botSlice = createSlice({
  name: "bot",
  initialState,
  reducers: {
    setInitState: (state, action) => {
      state.menu = action.payload.menu;
      state.attributes = action.payload.attributes;
      const details = action.payload.botDetails;
      details.icon = getFile("icon", details?.icon);
      state.botDetails = details;
    },
    setOldChat: (state, action) => {
      state.attributesData = action.payload.attributesData;
      state.chats = action.payload.chats;
    },
    setBotOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    sendMessage: (state, action) => {
      window.parent.postMessage(action.payload, "*");
    },
    setLocalData: (state, action) => {
      state.localData = action.payload;
    },
    setBotMute: (state, action) => {
      RECEIVE_AUDIO.muted = action.payload;
      SEND_AUDIO.muted = action.payload;
      state.isMute = action.payload;
    },
    setInfoData: (state, action) => {
      state.infoData = action.payload;
    },
    setLiveChat: (state, action) => {
      state.liveChatEnabled = action.payload.enable;
      state.agent = action.payload.agent;
    },
    setGalleryModel: (state, action) => {
      state.galleryData = action.payload?.data;
      state.showGalleryModel = action.payload?.show;
    },
    setChatLoading: (state, action) => {
      state.isChatLoading = !state.liveChatEnabled;
    },
    nextQues: (state, action) => {
      state.isInitChat = true;
      state.isChatLoading = false;
      let key = action.payload?.next;
      window.parent.postMessage(
        {
          flag: "setData",
          items: [{ key: "curMenu", value: key }],
        },
        "*"
      );
      state.localData = { ...state.localData, curMenu: key };

      const ele = state.menu[key];
      if (ele) {
        if (ele.type === "product") {
          let p = {};
          ele?.params &&
            ele.params.length > 0 &&
            ele?.params.map((e) => {
              p[e.key] = state.attributesData[e.value] || e?.defaultValue;
            });
          ele.params = p;
        }
        !state.isMute && RECEIVE_AUDIO.play();
        state.chats = [
          ...state.chats,
          {
            ...ele,
            align: "l",
            createdAt: moment().format("YYYY-MM-DD h:mm:ss"),
          },
        ];
        state.curMenu = ele;
      }
    },
    addChat: (state, action) => {
      if (action.payload?.save) {
        state.attributesData = {
          ...state.attributesData,
          [action.payload.save]: action.payload.mes,
        };
      }

      const chats = [
        ...state.chats,
        { ...action.payload, createdAt: moment().format("YYYY-MM-DD h:mm:ss") },
      ];
      if (action.payload.align === "l") !state.isMute && RECEIVE_AUDIO.play();
      else {
        !state.isMute && SEND_AUDIO.play();
        const index = chats.findIndex((ele) => ele.key == state.curMenu?.key);
        if (index != -1 && chats[index]?.opt) {
          chats[index].opt = [];
        }
      }
      state.chats = chats;
    },
    initSocket: (state, action) => {
      state.socket = io(process.env.REACT_APP_API);
    },
    removeSocket: (state, action) => {
      state.socket = null;
    },
    sendLiveChatReq: (state, action) => {
      state.socket.emit("initLiveChat", {
        apiKey: state.botDetails.apiKey,
        botId: state.botDetails.botId,
        botName: "Test",
        userId: state.botDetails.userId,
      });
    },
    sendMesSocket: (state, action) => {
      const data = {
        apiKey: state.botDetails.apiKey,
        botId: state.botDetails.botId,
        userId: state.botDetails.userId,
        agentId: state.agent.agentId,
        roomId: state.agent.roomId,
        mes: action.payload.mes,
        fromUser: true,
      };
      state.socket.emit("liveChat", data);
    },
    sendQuesSocket: (state, action) => {
      let mes = action.payload.mes;
      if (action.payload.type === "product") {
        let p = {};
        let para = state.menu[mes]?.params;
        para &&
          para.length > 0 &&
          para.map((e) => {
            p[e.key] = state.attributesData[e.value] || e?.defaultValue;
          });
        mes = JSON.stringify({
          key: mes,
          params: p,
        });
      }
      const data = {
        botId: state.botDetails.botId,
        userId: state.botDetails.userId,
        mes: mes,
        type: action.payload.type,
        fromUser: false,
      };
      state.socket.emit("newQues", data);
    },
    sendResSocket: (state, action) => {
      const data = {
        botId: state.botDetails.botId,
        userId: state.botDetails.userId,
        mes: action.payload.mes,
        save: action.payload.save,
        next: action.payload.next,
        resId: state.localData.resId,
        fromUser: true,
      };
      state.socket.emit("newChat", data);
    },
    setResponseId: (state, action) => {
      window.parent.postMessage(
        {
          flag: "setData",
          items: [{ key: "resId", value: action.payload?.resId }],
        },
        "*"
      );
      state.localData = { ...state.localData, resId: action.payload?.resId };
    },
  },
});

export const {
  setInitState,
  setOldChat,
  setBotOpen,
  sendMessage,
  setLocalData,
  setBotMute,
  setInfoData,
  setLiveChat,
  setGalleryModel,
  setChatLoading,
  nextQues,
  addChat,
  initSocket,
  removeSocket,
  sendLiveChatReq,
  sendMesSocket,
  sendQuesSocket,
  sendResSocket,
  setResponseId,
} = botSlice.actions;

export default botSlice.reducer;
