import { combineReducers } from "redux";
import Auth from "./Auth";
import Theme from "./Theme";
import LiveChat from "./LiveChat";
import Socket from "./Socket";
import Tree from "./Tree";

const reducers = combineReducers({
  theme: Theme,
  auth: Auth,
  liveChat: LiveChat,
  socket: Socket,
  tree: Tree,
});

export default reducers;
