import moment from "moment";
import React from "react";
import { getFile } from "../../../Utils/files";

function Image({ align, icon, item }) {
  return (
    <div className={align === "r" ? "chat-right" : "chat-left"}>
      <div className="chat-icon">
        <img src={icon} alt="" />
      </div>
      <div className="chat-mes bg p-1">
        <div className="image-wrapper">
          {item.files.map((img, i) => (
            <a key={i} href={getFile("widget", img.name)} target="_blank">
              <div className="img-wrap">
                <img src={getFile("widget", img.name)} alt="" />
              </div>
            </a>
          ))}
        </div>
        <div className="chat-time">
          {moment(item?.createdAt, "YYYY-MM-DD h:mm:ss").format("h:mm a")}
        </div>
      </div>
    </div>
  );
}

export default Image;
