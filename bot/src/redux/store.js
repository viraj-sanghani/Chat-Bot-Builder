import { configureStore } from "@reduxjs/toolkit";
import botReducer from "./reducers/botReducer";
import socketReducer from "./reducers/socketReducer";

export const store = configureStore({
  reducer: {
    bot: botReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["bot.socket"],
      },
    }),
});
