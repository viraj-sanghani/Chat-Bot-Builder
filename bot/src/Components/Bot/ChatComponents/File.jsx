import moment from "moment";
import React from "react";
import { getFile } from "../../../Utils/files";

function File({ align, icon, item }) {
  return (
    <div className={align === "r" ? "chat-right" : "chat-left"}>
      <div className="chat-icon">
        <img src={icon} alt="" />
      </div>
      <div className="chat-mes bg p-1">
        <div className="file-wrapper">
          {item.files.map((file, i) => (
            <a key={i} href={getFile("widget", file.name)} target="_blank">
              <div className="img-wrap">
                <img src={getFile("widget", file.preview)} alt="" />
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

export default File;
