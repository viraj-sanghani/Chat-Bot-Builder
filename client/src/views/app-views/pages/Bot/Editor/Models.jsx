import React, { useCallback, useEffect } from "react";
import {
  deleteModel,
  deleteSelected,
  moveDown,
  moveHorizontal,
  moveUp,
} from "redux/reducers/Tree";
import WidgetModel from "./WidgetModel";
import AddModel from "./AddModel";
import EditModel from "./EditModel";
import Alert from "components/shared-components/Alert/Alert";
import { useDispatch, useSelector } from "react-redux";

function Models() {
  const dispatch = useDispatch();
  const { widgetModelOpen, addModelOpen, editModelOpen, deleteModelOpen } =
    useSelector((state) => state.tree);

  const keepIt = () => {
    dispatch(deleteModel(false));
  };

  const deleteIt = () => {
    dispatch(deleteSelected());
    dispatch(deleteModel(false));
  };

  useEffect(() => {
    if (!addModelOpen && !editModelOpen) {
      document.addEventListener("keydown", _handleKeyDown);
      // document.addEventListener("click", _handleClick);
    }

    return () => {
      document.removeEventListener("keydown", _handleKeyDown);
      // document.removeEventListener("click", _handleClick);
    };
  }, [addModelOpen, editModelOpen]);

  const _handleKeyDown = useCallback((e) => {
    let keyPress;
    if (e.key) keyPress = e.key;
    else keyPress = e.which;

    if (keyPress === "ArrowRight" || keyPress === "37") {
      dispatch(moveHorizontal("right"));
    } else if (keyPress === "ArrowLeft" || keyPress === "39") {
      dispatch(moveHorizontal("left"));
    } else if (keyPress === "ArrowUp" || keyPress === "38") {
      dispatch(moveUp());
    } else if (keyPress === "ArrowDown" || keyPress === "40") {
      dispatch(moveDown());
    } else if (keyPress === "Delete" || keyPress === "46") {
      dispatch(deleteModel(true));
    }
  }, []);

  /* const _handleClick = useCallback((e) => {
    console.log(e);
    // dispatch(setSelectedNode(null));
  }, []); */
  return (
    <>
      {widgetModelOpen && <WidgetModel />}
      {addModelOpen && <AddModel />}
      {editModelOpen && <EditModel />}
      <Alert
        open={deleteModelOpen}
        animation="scale"
        data={{
          title: "Are You Sure! Want to Delete?",
          icon: "warning",
          extraInfo:
            "Do you really want to delete? You can't view this in your bot anymore if you delete!",
          buttons: [
            {
              type: "success",
              text: "No, Keep It",
              callback: keepIt,
            },
            {
              class: "red",
              type: "error",
              text: "Yes, Delete It",
              callback: deleteIt,
            },
          ],
        }}
      />
    </>
  );
}

export default Models;
