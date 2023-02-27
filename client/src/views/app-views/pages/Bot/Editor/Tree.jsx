import { Button } from "@mui/material";
import React from "react";
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

function Tree({ data, selected, root }) {
  const dispatch = useDispatch();

  return (
    <li className="tree-li">
      {selected?.key == data?.key && (
        <div className="action-btns">
          {selected?.type !== "list" && (
            <Button
              className="action-btn add-btn"
              onClick={() => dispatch(widgetModel(true))}
            >
              {icons.add}
            </Button>
          )}
          {selected?.type === "option" ? (
            <>
              <Button
                className="action-btn move-btn"
                onClick={() => dispatch(moveHorizontal("left"))}
              >
                {icons.arrowLeft}
              </Button>
              <Button
                className="action-btn move-btn"
                onClick={() => dispatch(moveHorizontal("right"))}
              >
                {icons.arrowRight}
              </Button>
            </>
          ) : (
            <>
              <Button
                className="action-btn move-btn"
                onClick={() => dispatch(moveUp())}
              >
                {icons.arrowUp}
              </Button>
              <Button
                className="action-btn move-btn"
                onClick={() => dispatch(moveDown())}
              >
                {icons.arrowDown}
              </Button>
            </>
          )}
          {!root && (
            <Button
              className="action-btn delete-btn"
              onClick={() => dispatch(deleteModel(true))}
            >
              {icons.delete}
            </Button>
          )}
          {selected?.type !== "option" && (
            <Button
              className="action-btn edit-btn"
              onClick={() => dispatch(editModel(true))}
            >
              {icons.edit}
            </Button>
          )}
        </div>
      )}
      <Button
        variant="contained"
        className={`tree-btn ${selected?.key == data?.key && "selected"}`}
        data-type={data?.type}
        data-key={data?.key}
        onClick={() =>
          setTimeout(() => {
            dispatch(setSelectedNode(data));
          }, 0)
        }
      >
        {data.type !== "option" && (
          <span className="icon-span">{icons[data.type]}</span>
        )}
        {data?.mes}
      </Button>
      {data?.next ? (
        <ul className="tree-ul">
          {<Tree data={data?.next} selected={selected} root={false} />}
        </ul>
      ) : (
        data?.opt && (
          <ul className="tree-ul">
            {data.opt.map((opt, i) => {
              return (
                <Tree key={i} data={opt} selected={selected} root={false} />
              );
            })}
          </ul>
        )
      )}
    </li>
  );
}

export default Tree;
