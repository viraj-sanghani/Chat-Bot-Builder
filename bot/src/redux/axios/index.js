import axios from "axios";
const API = axios.create({ baseURL: process.env.REACT_APP_API });

export const call = (callback) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await callback;
      if (data.success) {
        delete data.success;
        resolve(data);
      } else {
        delete data.success;
        reject(data);
      }
    } catch (err) {
      reject(err.response?.data?.message || "Something went wrong");
    }
  });
};

export const botInfo = (data) => call(API.get("/bot/info/" + data.id));
export const getChats = (data) =>
  call(API.get(`/api/chat/${data.botId}/${data.userId}`));
