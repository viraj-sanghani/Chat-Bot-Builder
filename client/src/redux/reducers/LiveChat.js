import {
  INIT_CHAT,
  NEW_CHAT,
  NEW_CUST,
  ROOMS_LIST,
  ROOM_UPDATE,
} from "../constants/LiveChat";

const initState = {
  rooms: [],
  messages: [],
};

const liveChat = (state = initState, action) => {
  switch (action.type) {
    case NEW_CUST:
      return {
        ...state,
        rooms: [action.payload, ...state.rooms],
      };
    case ROOMS_LIST:
      return {
        ...state,
        rooms: action.payload,
      };
    case ROOM_UPDATE: {
      return {
        ...state,
        rooms: state.rooms.map((ele) => {
          if (ele.roomId === action.payload.roomId) {
            ele.agentId = action.payload.agentId;
          }
          return ele;
        }),
      };
    }
    case INIT_CHAT: {
      return {
        ...state,
        messages: action.payload,
      };
    }
    case NEW_CHAT: {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    }

    default:
      return state;
  }
};

export default liveChat;
