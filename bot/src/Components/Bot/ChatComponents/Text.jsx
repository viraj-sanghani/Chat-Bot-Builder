import React from "react";
import moment from "moment";

function Text({ align, icon, item }) {
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
    </div>
  );
}

export default Text;
