import axios from "axios";
import { error } from "components/shared-components/Toast/Toast";
import { AUTH_TOKEN } from "redux/constants/Auth";

const API = axios.create({ baseURL: process.env.REACT_APP_API + "/api" });
const API1 = axios.create({ baseURL: process.env.REACT_APP_API + "/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem(AUTH_TOKEN)) {
    req.headers.Authorization = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
  }
  return req;
});

API1.interceptors.request.use((req) => {
  if (localStorage.getItem(AUTH_TOKEN)) {
    req.headers.Authorization = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    req.headers.contentType = "multipart/form-data";
  }
  return req;
});

export const call = (callback) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await callback;
      if (data.success) {
        delete data.success;
        resolve(data);
      } else {
        if (data.message === "Invalid token") {
          error("Invalid token, please login again");
        }
        delete data.success;
        console.log(data);
        reject(data);
      }
    } catch (err) {
      if (err.response?.data?.message === "Invalid token") {
        error("Invalid token, please login again");
      } else reject(err.response?.data?.message || "Something went wrong");
    }
  });
};

// Authentication

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const verifyToken = () => API.get("/auth/verify");
export const changePassword = (data) => API.post("/auth/changepassword", data);
export const forgotPassword = (data) => API.post("/auth/forgotpassword", data);
export const forgotLinkvalid = (data) =>
  API.post("/auth/forgotLinkvalid", data);
export const resetPassword = (data) => API.post("/auth/resetpassword", data);
export const profileInfo = () => API.get("/auth/profileInfo");
export const editProfile = (data) => API.put("/auth/editProfile", data);

export const agents = () => API.get("/agent");
export const getAgents = () => API.get("/agent/list");
export const agentInfo = (data) => API.get("/agent/info/" + data.id);
export const agentAdd = (data) => API.post("/auth/agent/add", data);
export const agentUpdate = (data) => API.put("/agent/edit", data);

export const getBots = () => API.get("/bot");
export const botAdd = (data) => API1.post("/bot/add", data);
export const botInfo = (data) => API.get("/bot/info/" + data.id);
export const botMenu = (data) => API.get("/bot/menu/" + data.id);
export const botUpdate = (data) => API.put("/bot/edit", data);
export const botMenuUpdate = (data) => API.put("/bot/menu/edit", data);

export const getUsers = (data) => API.get("/user/" + data.botId);
export const getUserInfo = (data) => API.get("/user/info/" + data.userId);

export const getRooms = () => API.get(`/room`);
export const updateRoom = (data) => API.put("/room/edit", data);

export const getChats = (data) => API.get(`/chat/${data.botId}/${data.userId}`);

export const getReport = (data) => API.post(`/report`, data);
export const getReportDashboard = () => API.get(`/report`);

export const getTimesheets = (data) => API.post("/report/timesheet", data);
export const getTimesheetsAll = (data) =>
  API.post("/report/timesheet/all", data);
export const getDurationslots = (data) =>
  API.post("/report/durationslots", data);
export const getInactiveslots = (data) =>
  API.post("/report/inactiveslots", data);
export const getSnaps = (data) => API.post("/report/snaps", data);
export const getVideos = (data) => API.post("/report/videos", data);

export const monitoringTitleList = () =>
  API.get("/setting/monitoring/titleList");
export const monitoringList = () => API.get("/setting/monitoring/List");
export const monitoringAdd = (data) => API.post("/setting/monitoring", data);
export const monitoringUpdate = (data) =>
  API.put("/setting/monitoring/" + data.id, data);
export const monitoringDelete = (data) =>
  API.delete("/setting/monitoring/" + data.id);
