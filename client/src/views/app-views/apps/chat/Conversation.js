import React, { useRef, useEffect, useState } from "react";
import ChatData from "assets/data/chat.data.json";
import { Avatar, Divider, Input, Form, Button, Menu } from "antd";
import {
  FileOutlined,
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
  AudioMutedOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Scrollbars } from "react-custom-scrollbars";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { call, getChats } from "redux/axios";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_DATA } from "redux/constants/Auth";
import { initChat, newChat } from "redux/actions/LiveChat";
import Utils from "utils";

const Conversation = (props) => {
  const { botId, userId: id } = props;
  const chatBodyRef = useRef(null);
  const [info, setInfo] = useState({});
  const dispatch = useDispatch();
  const [mes, setMes] = useState("");
  const { rooms, messages } = useSelector((state) => state.liveChat);
  const { id: userId } = JSON.parse(localStorage.getItem(AUTH_DATA));
  const { socket } = useSelector((state) => state.socket);

  const getConversation = async () => {
    try {
      const res = await call(getChats({ botId, userId: id }));
      setInfo({ userId: id });
      dispatch(initChat(res.data));
    } catch (err) {
      console.log(err);
    }
    // const data = ChatData.filter((elm) => elm.id === currentId);
  };

  const scrollToBottom = () => {
    chatBodyRef.current?.scrollToBottom();
  };

  const newMes = (message, fromUser) => {
    dispatch(newChat({ message, fromUser }));
  };

  const initChatListener = () => {
    socket.on("receiveMes", (data) => {
      newMes(data.mes, true);
    });
  };
  const removeChatListener = () => {
    socket.removeListener("receiveMes");
  };

  useEffect(() => {
    // console.log(rooms);
  }, [rooms]);

  useEffect(() => {
    scrollToBottom();
    // console.log(messages);
  }, [messages]);

  useEffect(() => {
    getConversation();
  }, []);

  useEffect(() => {
    if (props.location.pathname !== props.location.pathname) {
      getConversation();
    }
    initChatListener();
    return () => removeChatListener();
  }, [props?.location]);

  const onSend = () => {
    if (mes) {
      socket.emit("liveChat", {
        botId: botId,
        userId: id,
        agentId: userId,
        mes: mes,
        fromUser: false,
      });
      setMes("");
      newMes(mes, false);
    }
  };

  const handlekeyDown = (e) => {
    e.keyCode === 13 && onSend();
  };
  return (
    <div className="chat-content">
      <div className="chat-content-header">
        <h4 className="mb-0">{info.userId}</h4>
        <div>{/* <EllipsisDropdown menu={menu} /> */}</div>
      </div>
      <div className="chat-content-body p-0">
        <Scrollbars ref={chatBodyRef} autoHide>
          {messages.length > 0 &&
            messages.map((elm, i) => (
              <div
                key={`msg-${i}`}
                className={`msg ${elm.fromUser ? "msg-recipient" : "msg-sent"}`}
              >
                {elm?.avatar && elm?.fromUser ? (
                  <div className="mr-2">
                    <Avatar src={elm?.avatar} />
                  </div>
                ) : null}
                {elm?.message ? (
                  <div className={`bubble ${!elm?.avatar ? "ml-5" : ""}`}>
                    <div className="bubble-wrapper">
                      <span>{elm?.message}</span>
                    </div>
                  </div>
                ) : null}
                {elm?.avatar && !elm?.fromUser ? (
                  <div className="ml-2">
                    <Avatar src={elm?.avatar} />
                  </div>
                ) : null}
              </div>
            ))}
        </Scrollbars>
      </div>
      <div className="chat-content-footer">
        <div className="w-100">
          <Input
            autoComplete="off"
            placeholder="Type a message..."
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            onKeyDown={handlekeyDown}
            suffix={
              <div className="d-flex align-items-center">
                {/* <a
                  href="/#"
                  className="text-dark font-size-lg mr-3"
                  onClick={this.emptyClick}
                >
                  <SmileOutlined />
                </a>
                <a
                  href="/#"
                  className="text-dark font-size-lg mr-3"
                  onClick={this.emptyClick}
                >
                  <PaperClipOutlined />
                </a> */}
                <Button
                  shape="circle"
                  type="primary"
                  size="small"
                  onClick={onSend}
                >
                  <SendOutlined />
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Conversation;
