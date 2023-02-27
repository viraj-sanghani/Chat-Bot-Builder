import "./editor.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tree from "./Tree";
import Models from "./Models";
import { Button } from "antd";
import { fetchMenu, saveMenu } from "redux/actions/Tree";

export default function Editor(props) {
  const botId = parseInt(props.match.params.id);
  const dispatch = useDispatch();
  const { data, selected } = useSelector((state) => state.tree);

  useEffect(() => {
    fetchMenu(dispatch, botId);
  }, []);

  return (
    <>
      <Button
        variant="contained"
        className="save-btn"
        onClick={() => saveMenu({ botId, menu: data })}
      >
        Save Changes
      </Button>
      <div id="editor">
        <div className="editor-box">
          <ul className="tree">
            <Tree data={data} selected={selected} root={true} />
          </ul>
        </div>
        <Models />
      </div>
    </>
  );
}
