import { Button } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { addModel, widgetModel } from "redux/reducers/Tree";
import icons from "utils/icons";

function WidgetModel() {
  const dispatch = useDispatch();

  const createNewNode = (t) => {
    dispatch(widgetModel(false));
    dispatch(addModel({ open: true, type: t }));
  };

  return (
    <div className="model-container">
      <div className="model-wrap setting-con">
        <Button
          className="model-close-btn"
          variant="contained"
          onClick={() => dispatch(widgetModel(false))}
        >
          {icons.close}
        </Button>
        <div className="s-con-item">
          <h4>Add widget</h4>
          <div className="s-con-wid-wrap">
            <div className="wid-item" onClick={() => createNewNode("text")}>
              <div className="wid-icon">{icons.text}</div>
              <div className="wid-title">Text</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("question")}>
              <div className="wid-icon">{icons.question}</div>
              <div className="wid-title">Question</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("list")}>
              <div className="wid-icon">{icons.list}</div>
              <div className="wid-title">List</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("form")}>
              <div className="wid-icon">{icons.form}</div>
              <div className="wid-title">Form</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("url")}>
              <div className="wid-icon">{icons.url}</div>
              <div className="wid-title">URL</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("file")}>
              <div className="wid-icon">{icons.file}</div>
              <div className="wid-title">File</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("image")}>
              <div className="wid-icon">{icons.image}</div>
              <div className="wid-title">Image</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("gallery")}>
              <div className="wid-icon">{icons.gallery}</div>
              <div className="wid-title">Gallery</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("video")}>
              <div className="wid-icon">{icons.video}</div>
              <div className="wid-title">Video</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("product")}>
              <div className="wid-icon">{icons.product}</div>
              <div className="wid-title">Product</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("liveChat")}>
              <div className="wid-icon">{icons.liveChat}</div>
              <div className="wid-title">Live Chat</div>
            </div>
            <div className="wid-item" onClick={() => createNewNode("jump")}>
              <div className="wid-icon">{icons.jump}</div>
              <div className="wid-title">Jump</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(WidgetModel);
