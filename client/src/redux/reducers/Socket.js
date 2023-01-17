import { ROOM_UPDATE } from "redux/constants/LiveChat";
import { SOCKET_UPDATE } from "../constants/Socket";

const initState = {
  socket: null,
};

const socket = (state = initState, action) => {
  switch (action.type) {
    case SOCKET_UPDATE:
      return {
        ...state,
        socket: action.payload,
      };

    case ROOM_UPDATE:
      state.socket.emit("agentAccept", {
        agentId: action.payload.agentId,
        roomId: action.payload.roomId,
      });

    default:
      return state;
  }
};

export default socket;
