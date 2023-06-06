import React from "react";
import { Button, Tooltip, Zoom } from "@mui/material";
import { success } from "components/shared-components/Toast/Toast";
import { useDispatch } from "react-redux";
import {
  editModel,
  moveUp,
  moveDown,
  moveHorizontal,
  setSelectedNode,
  widgetModel,
  deleteModel,
} from "redux/reducers/Tree";
import icons from "utils/icons";

function Tree({ data, selected, code, node }) {
  const dispatch = useDispatch();

  return (
    <li className="tree-li">
      {selected?.key == node?.key && (
        <div className="action-btns">
          {selected?.type !== "list" && (
            <Tooltip TransitionComponent={Zoom} title="Add Widget" arrow>
              <Button
                className="action-btn add-btn"
                onClick={() => dispatch(widgetModel(true))}
              >
                {icons.add}
              </Button>
            </Tooltip>
          )}
          {selected?.type === "option" ? (
            <>
              <Tooltip TransitionComponent={Zoom} title="Move Left" arrow>
                <Button
                  className="action-btn move-btn"
                  onClick={() => dispatch(moveHorizontal("left"))}
                >
                  {icons.arrowLeft}
                </Button>
              </Tooltip>
              <Tooltip TransitionComponent={Zoom} title="Move Right" arrow>
                <Button
                  className="action-btn move-btn"
                  onClick={() => dispatch(moveHorizontal("right"))}
                >
                  {icons.arrowRight}
                </Button>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip TransitionComponent={Zoom} title="Move Up" arrow>
                <Button
                  className="action-btn move-btn"
                  onClick={() => dispatch(moveUp())}
                >
                  {icons.arrowUp}
                </Button>
              </Tooltip>
              <Tooltip TransitionComponent={Zoom} title="Move Down" arrow>
                <Button
                  className="action-btn move-btn"
                  onClick={() => dispatch(moveDown())}
                >
                  {icons.arrowDown}
                </Button>
              </Tooltip>
            </>
          )}
          {code !==
            Object.values(data).filter((e) => e.prev === null)[0].key && (
            <Tooltip TransitionComponent={Zoom} title="Delete" arrow>
              <Button
                className="action-btn delete-btn"
                onClick={() => dispatch(deleteModel(true))}
              >
                {icons.delete}
              </Button>
            </Tooltip>
          )}
          {selected?.type !== "option" && (
            <Tooltip TransitionComponent={Zoom} title="Edit" arrow>
              <Button
                className="action-btn edit-btn"
                onClick={() => dispatch(editModel(true))}
              >
                {icons.edit}
              </Button>
            </Tooltip>
          )}
          {!["jump", "option"].includes(selected?.type) && (
            <Tooltip TransitionComponent={Zoom} title="Copy key" arrow>
              <Button
                className="action-btn copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(node.key);
                  success("Key Copied!");
                }}
              >
                {icons.copy}
              </Button>
            </Tooltip>
          )}
          {selected?.type === "jump" && (
            <Tooltip TransitionComponent={Zoom} title="Focus To Target" arrow>
              <Button
                className="action-btn jump-btn"
                onClick={() => dispatch(setSelectedNode({ key: node?.target }))}
              >
                {icons.jump}
              </Button>
            </Tooltip>
          )}
        </div>
      )}
      <Button
        variant="contained"
        className={`tree-btn ${selected?.key == node?.key && "selected"}`}
        data-type={node?.type}
        data-key={node?.key}
        onClick={() =>
          setTimeout(() => {
            dispatch(setSelectedNode(node));
          }, 0)
        }
      >
        {node?.type !== "option" && (
          <span className="icon-span">{icons[node?.type]}</span>
        )}
        {node?.mes || node?.target}
      </Button>
      {node?.next ? (
        <ul className="tree-ul">
          {
            <Tree
              data={data}
              selected={selected}
              code={node.next}
              node={data[node.next]}
            />
          }
        </ul>
      ) : (
        node?.opt && (
          <ul className="tree-ul">
            {node.opt.map((opt, i) => {
              return (
                <Tree
                  key={i}
                  data={data}
                  selected={selected}
                  code={opt.key}
                  node={opt}
                />
              );
            })}
          </ul>
        )
      )}
    </li>
  );
}

export default Tree;
