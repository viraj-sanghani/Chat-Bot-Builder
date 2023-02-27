import { createSlice } from "@reduxjs/toolkit";
import {
  moveNodeHori,
  deleteNode,
  addNode,
  updateNode,
  getNode,
  moveNodeUp,
  moveNodeDown,
  getParentkey,
} from "../../utils/editor";

const initialState = {
  selected: {},
  data: {},
  attributes: [],
  widgetModelOpen: false,
  addModelOpen: false,
  editModelOpen: false,
  deleteModelOpen: false,
};

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setInitState: (state, action) => {
      state.data = action.payload.data;
      state.attributes = action.payload.attr;
    },
    setSelectedNode: (state, action) => {
      state.selected = getNode(state.data, action.payload?.key);
    },
    moveHorizontal: (state, action) => {
      state.selected?.key &&
        (state.data = moveNodeHori(
          state.data,
          state.selected.key,
          action.payload
        ));
    },
    moveUp: (state, action) => {
      if (state.selected?.key) {
        const key = getParentkey(state.data, state.selected.key);
        if (key) {
          state.data = moveNodeUp(state.data, key, action.payload);
        }
      }
    },
    moveDown: (state, action) => {
      state.selected?.key &&
        (state.data = moveNodeDown(
          state.data,
          state.selected.key,
          action.payload
        ));
    },
    deleteSelected: (state, action) => {
      if (state.selected?.key) {
        state.data = deleteNode(state.data, state.selected.key);
        state.selected = {};
      }
    },
    addNew: (state, action) => {
      let data = action.payload;
      let key = Math.round(Math.random() * 1000000);

      const newNode = {
        ...data,
        key,
      };
      state.data = addNode(state.data, state.selected.key, newNode);
      state.selected = newNode;
      state.addModelOpen = false;
    },
    editNode: (state, action) => {
      let data = action.payload;

      state.data = updateNode(state.data, state.selected.key, data);
      state.selected = getNode(state.data, state.selected.key);
      state.editModelOpen = false;
    },
    widgetModel: (state, action) => {
      state.widgetModelOpen = action.payload;
    },
    addModel: (state, action) => {
      state.addModelOpen = action.payload.open;
      state.widgetType = action.payload?.type || null;
    },
    editModel: (state, action) => {
      state.editModelOpen = action.payload;
    },
    deleteModel: (state, action) => {
      state.deleteModelOpen = action.payload;
    },
    saveAttribute: (state, action) => {
      state.attributes = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setInitState,
  setSelectedNode,
  moveHorizontal,
  moveUp,
  moveDown,
  deleteSelected,
  widgetModel,
  addNew,
  editNode,
  saveAttribute,
  addModel,
  editModel,
  deleteModel,
} = treeSlice.actions;

export default treeSlice.reducer;
