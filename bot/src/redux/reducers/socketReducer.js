import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket: (state, action) => {
      state.socket = io(process.env.REACT_APP_API);
    },
    removeSocket: (state, action) => {
      state.socket = null;
    },
    sendMesSocket: (state, action) => {
      state.socket.emit("liveChat", { ...action.payload });
    },
    newChatSocket: (state, action) => {
      const resId = localStorage.getItem("resId");
      state.socket.emit("newChat", { ...action.payload, resId });
    },
    setResponseId: (state, action) => {
      localStorage.setItem("resId", action.payload?.resId);
    },
  },
});

export const {
  initSocket,
  removeSocket,
  sendMesSocket,
  newChatSocket,
  setResponseId,
} = socketSlice.actions;

export default socketSlice.reducer;
