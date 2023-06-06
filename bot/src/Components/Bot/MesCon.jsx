import React, { Fragment, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newRes } from "../../redux/actions/bot";
import {
  sendLiveChatReq,
  setGalleryModel,
} from "../../redux/reducers/botReducer";
import { getFile } from "../../Utils/files";
import {
  Text,
  List,
  URL,
  Image,
  Gallery,
  Video,
  File,
  Form,
  Product,
  LiveChat,
  DateTitle,
} from "./ChatComponents";

function MesCon() {
  const dispatch = useDispatch();
  const chatConRef = useRef(null);
  const { menu, chats, isChatLoading, attributesData } = useSelector(
    (state) => state.bot
  );

  const AGENT_IMG = getFile("avatar", "default-male.png");
  const CUSTOMER_IMG = getFile("avatar", "customer.png");

  const scrollToBottom = () => {
    setTimeout(() => {
      const scrollHeight = chatConRef.current.scrollHeight;
      const height = chatConRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatConRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const showGallery = (data, slide) => {
    dispatch(setGalleryModel({ data: { data, slide }, show: true }));
  };

  const selectBtn = (btn) => {
    dispatch(newRes(btn.mes, menu[btn.parent].save, false, menu, btn.next));
  };

  const liveChatBtn = (btn) => {
    if (btn.mes === "Yes") {
      dispatch(sendLiveChatReq());
    }
    selectBtn(btn);
  };

  const icon = (align) => (align === "r" ? CUSTOMER_IMG : AGENT_IMG);

  const mes = {
    text: (i, a, item) => <Text key={i} align={a} icon={icon(a)} item={item} />,

    question: (i, a, item) => (
      <Text key={i} align={a} icon={icon(a)} item={item} />
    ),

    list: (i, a, item) => (
      <List
        key={i}
        align={a}
        icon={icon(a)}
        item={item}
        selectBtn={selectBtn}
      />
    ),

    liveChat: (i, a, item) => (
      <LiveChat
        key={i}
        align={a}
        icon={icon(a)}
        item={item}
        liveChatBtn={liveChatBtn}
      />
    ),

    url: (i, a, item) => <URL key={i} align={a} icon={icon(a)} item={item} />,

    image: (i, a, item) => (
      <Image key={i} align={a} icon={icon(a)} item={item} />
    ),

    gallery: (i, a, item) => (
      <Gallery
        key={i}
        align={a}
        icon={icon(a)}
        item={item}
        showGallery={showGallery}
      />
    ),

    video: (i, a, item) => (
      <Video key={i} align={a} icon={icon(a)} item={item} />
    ),

    file: (i, a, item) => <File key={i} align={a} icon={icon(a)} item={item} />,

    form: (i, a, item) => <Form key={i} align={a} icon={icon(a)} item={item} />,

    product: (i, a, item) => (
      <Product key={i} align={a} icon={icon(a)} item={item} />
    ),

    dateTitle: (i, mes) => <DateTitle key={i} mes={mes} />,
  };

  let last, cur;

  return (
    <div className="chat-container" ref={chatConRef}>
      {chats.length > 0 &&
        chats.map((chat, i) => {
          cur = chat.createdAt.split(" ")[0];
          if (last === cur) return mes[chat.type](i, chat.align, chat);
          else {
            last = cur;
            return (
              <Fragment key={i}>
                {mes["dateTitle"](i + "1", cur)}
                {mes[chat.type](i + "2", chat.align, chat)}
              </Fragment>
            );
          }
        })}
      {isChatLoading && (
        <div className="chat-left">
          <div className="chat-mes">
            <div className="chat-bot-loading-text"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MesCon;
