import { Button } from "@mui/material";
import moment from "moment";
import React from "react";

function LiveChat({ align, icon, item, liveChatBtn }) {
  return (
    <div className={align === "r" ? "chat-right" : "chat-left"}>
      <div className="chat-icon">
        <img src={icon} alt="" />
      </div>
      <div className="chat-mes bg">
        {item.mes}
        <div className="chat-time">
          {moment(item?.createdAt, "YYYY-MM-DD h:mm:ss").format("h:mm a")}
        </div>
      </div>
      <div className="option-wrap">
        {item.opt.map((o, i) => (
          <Button
            key={i}
            variant="contained"
            className="option-btn"
            onClick={() => liveChatBtn(o)}
          >
            {o.mes}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default LiveChat;
