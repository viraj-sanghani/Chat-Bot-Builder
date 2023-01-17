import { combineReducers } from "redux";
import Auth from "./Auth";
import Theme from "./Theme";
import LiveChat from "./LiveChat";
import Socket from "./Socket";

const reducers = combineReducers({
  theme: Theme,
  auth: Auth,
  liveChat: LiveChat,
  socket: Socket,
});

export default reducers;
