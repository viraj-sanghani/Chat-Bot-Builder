import "./editor.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tree from "./Tree";
import Models from "./Models";
import { Button } from "antd";
import { fetchMenu, saveMenu } from "redux/actions/Tree";
import { Slider } from "@mui/material";

export default function Editor(props) {
  const botId = parseInt(props.match.params.id);
  const dispatch = useDispatch();
  const { data, selected } = useSelector((state) => state.tree);
  const [code, setCode] = useState();

  useEffect(() => {
    const ele = Object.values(data).filter((e) => e.prev === null);
    ele[0] && setCode(ele[0].key);
  }, [data]);

  useEffect(() => {
    fetchMenu(dispatch, botId);
  }, []);

  return (
    <>
      <div className="editor-header">
        <Slider
          className="zoom-control"
          size="small"
          defaultValue={100}
          min={1}
          max={100}
          aria-label="small"
          valueLabelDisplay="auto"
          onChange={(e) =>
            document.documentElement.style.setProperty(
              "--zoom",
              (e.target.value / 2 + 50) / 100
            )
          }
        />
        <Button
          variant="contained"
          className="save-btn"
          onClick={() => saveMenu({ botId, menu: data })}
        >
          Save Changes
        </Button>
      </div>
      <div id="editor">
        <div className="editor-box">
          <ul className="tree">
            {code && (
              <Tree
                data={data}
                selected={selected}
                code={code}
                node={data[code]}
              />
            )}
          </ul>
        </div>
        <Models />
      </div>
    </>
  );
}
