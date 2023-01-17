import { SOCKET_UPDATE } from "../constants/Socket";

export const socketUpdate = (data) => {
  return {
    type: SOCKET_UPDATE,
    payload: data,
  };
};
