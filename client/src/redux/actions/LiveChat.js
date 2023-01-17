import {
  INIT_CHAT,
  NEW_CHAT,
  NEW_CUST,
  ROOMS_LIST,
  ROOM_UPDATE,
} from "../constants/LiveChat";

export const newCustomer = (data) => {
  return {
    type: NEW_CUST,
    payload: data,
  };
};

export const roomsList = (data) => {
  return {
    type: ROOMS_LIST,
    payload: data,
  };
};

export const roomUpdate = (data) => {
  return {
    type: ROOM_UPDATE,
    payload: data,
  };
};

export const initChat = (data) => {
  return {
    type: INIT_CHAT,
    payload: data,
  };
};

export const newChat = (data) => {
  return {
    type: NEW_CHAT,
    payload: data,
  };
};
