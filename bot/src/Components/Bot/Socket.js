import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newRes } from "../../redux/actions/bot";
import { addChat, setLiveChat } from "../../redux/reducers/botReducer";
import {
  initSocket,
  removeSocket,
  setResponseId,
} from "../../redux/reducers/botReducer";

function Socket() {
  const dispatch = useDispatch();
  const { menu, botDetails, infoData, socket } = useSelector(
    (state) => state.bot
  );

  const init = useCallback(
    (data) => {
      if (socket) {
        // socket.on("connect", () => {
        socket.emit("join", {
          botId: data?.botId,
          userId: data?.userId,
          name: data?.name,
          email: data?.email,
          mobile: data?.mobile,
          isAgent: false,
        });

        socket.on("receiveMes", function (d) {
          d?.sender !== socket.id &&
            dispatch(
              addChat({
                mes: d?.mes,
                type: "text",
                align: d?.fromUser ? "r" : "l",
              })
            );
        });

        socket.on("agentAllocated", function (d) {
          dispatch(setLiveChat({ enable: true, agent: d }));
          // data?.picture &&
          //   (AGENT_IMG = API_URL + "api/agent/picture/50/" + data?.picture);
          dispatch(
            addChat({
              mes: d?.fullName + " is connected",
              type: "text",
              align: "l",
            })
          );
        });

        socket.on("sendMes", function (d) {
          d?.sender !== socket.id &&
            dispatch(newRes(d.mes, false, true, data.menu, d.next));
        });

        socket.on("newResponse", function (d) {
          dispatch(setResponseId({ resId: d?.resId }));
        });

        // });
      }
    },
    [socket]
  );

  const remove = useCallback(() => {}, []);

  useEffect(() => {
    dispatch(initSocket());
    return () => {
      dispatch(removeSocket());
    };
  }, []);

  useEffect(() => {
    if (botDetails.botId) {
      if (!botDetails.infoForm || infoData?.name) {
        init({
          botId: botDetails?.botId,
          userId: botDetails?.userId,
          menu,
          ...infoData,
        });
      }
    }

    return () => {
      remove();
    };
  }, [botDetails, infoData]);

  return <></>;
}

export default Socket;
