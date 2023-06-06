import { botInfo, getChats } from "../axios";
import {
  addChat,
  sendResSocket,
  nextQues,
  setChatLoading,
  setInitState,
  sendMesSocket,
  sendQuesSocket,
  sendMessage,
  setBotOpen,
  setOldChat,
} from "../reducers/botReducer";

const setPopup = (value) => (dispatch) => {
  value
    ? dispatch(sendMessage({ flag: "changeOpen", value }))
    : dispatch(setBotOpen(value));
  setTimeout(() => {
    value
      ? dispatch(setBotOpen(value))
      : dispatch(sendMessage({ flag: "changeOpen", value }));
  }, 100);
};

const fetchData = (key, d) => async (dispatch) => {
  try {
    const res = await botInfo({ id: key });
    const data = res.data.bot;
    const menu = data.menu;
    const attributes = data.attributes;
    delete data.menu;
    delete data.attributes;

    let userId;
    if (d?.userId && d?.apiKey == key && d?.botId == data.botId) {
      data.infoForm = 0;
      userId = parseInt(d?.userId);
    } else {
      userId = parseInt(
        (Date.now() + Math.random()).toString().split(".").join("")
      );
      const s = [];
      s.push({ key: "userId", value: userId });
      s.push({ key: "apiKey", value: key });
      s.push({ key: "botId", value: data.botId });
      dispatch(sendMessage({ flag: "setData", items: s }));
    }

    dispatch(
      setInitState({
        menu,
        attributes,
        botDetails: { ...data, userId, apiKey: res.data.apiKey },
      })
    );
    document.documentElement.style.setProperty(
      "--chat-bot-bg",
      data.background
    );
  } catch (err) {
    console.log(err);
  }
};

const fetchOldChats = async (menu, botId, userId) => {
  let chats = [];
  const res1 = await getChats({ botId, userId });

  if (res1?.data && Array.isArray(res1.data)) {
    chats = res1.data.map((e) => {
      if (e.type === "product") {
        const { key, params } = JSON.parse(e.message);
        return {
          ...menu[key],
          params,
          align: e.fromUser ? "r" : "l",
          createdAt: e.createdAt,
        };
      } else if (e.type !== "text") {
        return {
          ...menu[e.message],
          align: e.fromUser ? "r" : "l",
          createdAt: e.createdAt,
        };
      } else
        return {
          type: e.type,
          mes: e.message,
          align: e.fromUser ? "r" : "l",
          createdAt: e.createdAt,
        };
    });
  }

  const attributesData = res1?.attributesData || {};

  return {
    chats,
    attributesData,
  };
};

const checkWaiting = (type) => {
  return ["question", "list", "form", "liveChat"].includes(type);
};

const getMes = (item) => {
  if (
    ["image", "gallery", "video", "file", "form", "product"].includes(
      item?.type
    )
  ) {
    return { mes: item?.key, type: item?.type };
  }
  return { mes: item?.mes, type: "text" };
};

const sendNextQues = (menu, key, received) => (dispatch) => {
  dispatch(setChatLoading());
  let ele = menu[key];
  if (ele?.target) {
    ele = menu[ele?.target];
  }
  setTimeout(() => {
    const next = ele && !checkWaiting(ele.type) ? ele?.next : false;
    const data = getMes(ele);
    (!ele || (ele && !checkWaiting(ele.type))) &&
      !received &&
      dispatch(sendQuesSocket(data));
    dispatch(nextQues({ next: ele.key }));
    next && dispatch(sendNextQues(menu, next, received));
  }, 1000);
};

const initChat = (menu, key, botId, userId) => async (dispatch) => {
  try {
    const res = await fetchOldChats(menu, botId, userId);
    dispatch(setOldChat(res));
  } catch (err) {}
  if (menu[key]) {
    dispatch(sendNextQues(menu, key));
  } else {
    let ele = Object.values(menu).filter((e) => e.prev === null);
    if (ele[0]) {
      dispatch(sendNextQues(menu, ele[0].key));
    }
  }
};

const newRes =
  (val, save, received, menu, key = null) =>
  (dispatch) => {
    const m = menu[menu[key]?.prev];
    const data = getMes(m);
    !received && dispatch(sendQuesSocket(data));
    dispatch(addChat({ type: "text", mes: val, save: save, align: "r" }));
    dispatch(sendNextQues(menu, key, received));
    !received && dispatch(sendResSocket({ mes: val, save, next: key }));
  };

const newMes = (val) => (dispatch) => {
  dispatch(addChat({ type: "text", mes: val, align: "r" }));
  dispatch(sendMesSocket({ mes: val }));
};

export { setPopup, fetchData, initChat, newRes, newMes };
