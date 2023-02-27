import { error, success } from "components/shared-components/Toast/Toast";
import { botAttrUpdate, botMenu, botMenuUpdate, call } from "redux/axios";
import { saveAttribute, setInitState } from "redux/reducers/Tree";

export const fetchMenu = async (dispatch, id) => {
  try {
    const res = await call(botMenu({ id }));
    dispatch(setInitState({ data: res.data, attr: res.attr }));
  } catch (err) {
    error(err);
  }
};

export const saveMenu = async (data) => {
  try {
    await call(botMenuUpdate(data));
    success("Updated Successfully");
  } catch (err) {
    error(err);
  }
};

export const saveAttr = async (dispatch, data) => {
  try {
    await call(botAttrUpdate(data));
    dispatch(saveAttribute(data.attr));
    success("Add Attribute Successfully");
  } catch (err) {
    error(err);
  }
};
