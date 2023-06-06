import moment from "moment";
import React from "react";
import { getFile } from "../../../Utils/files";

function Gallery({ align, icon, item }) {
  return (
    <div className={align === "r" ? "chat-right" : "chat-left"}>
      <div className="chat-icon">
        <img src={icon} alt="" />
      </div>
      <div className="chat-mes bg p-1">
        <div className="video-wrapper">
          {item.files.map((video, i) => (
            <video key={i} controls controlsList="nodownload">
              <source src={getFile("widget", video.name)} />
            </video>
          ))}
        </div>
        <div className="chat-time">
          {moment(item?.createdAt, "YYYY-MM-DD h:mm:ss").format("h:mm a")}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
