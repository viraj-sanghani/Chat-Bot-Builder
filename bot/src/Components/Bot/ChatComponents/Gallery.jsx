import moment from "moment";
import React from "react";
import { getFile } from "../../../Utils/files";

function Gallery({ align, icon, item, showGallery }) {
  return (
    <div className={align === "r" ? "chat-right" : "chat-left"}>
      <div className="chat-icon">
        <img src={icon} alt="" />
      </div>
      <div className="chat-mes bg p-1">
        <div className="gallery-wrapper">
          {item.files.map((img, i) => (
            <div
              key={i}
              className="img-wrap"
              onClick={() => showGallery(item.files, i)}
            >
              <img src={getFile("widget", img.name)} alt="" />
            </div>
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
