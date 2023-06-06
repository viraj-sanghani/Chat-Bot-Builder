import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNew, addModel } from "redux/reducers/Tree";
import { isURL } from "utils/editor";
import { useDropzone } from "react-dropzone";
import icons from "utils/icons";
import {
  error,
  success,
  warning,
} from "components/shared-components/Toast/Toast";
import { saveAttr } from "redux/actions/Tree";
import { useParams } from "react-router-dom";
import { uploadWidget } from "redux/axios";
import ReactJson from "react-json-view";
import axios from "axios";
const sample = {
  data: [
    {
      id: 1,
      title: "abc",
      img: "",
      desc: "",
      url: "",
    },
    {
      id: 2,
      title: "def",
      img: "",
      desc: "",
      url: "",
    },
    {
      id: 3,
      title: "ghi",
      img: "",
      desc: "",
      url: "",
    },
  ],
};

function AddModel() {
  const dispatch = useDispatch();
  const params = useParams();
  const { selected, attributes, widgetType } = useSelector(
    (state) => state.tree
  );
  const [value, setValue] = useState({});
  const [btnList, setBtnList] = useState([]);
  const [files, setFiles] = useState([]);
  const [saveRes, setSaveRes] = useState(false);
  const [attrModelOpen, setAttrModelOpen] = useState(false);
  const [attribute, setAttribute] = useState(attributes[0] || "");
  const [fieldList, setFieldList] = useState([]);
  const [paramsList, setParamsList] = useState([]);
  const [response, setResponse] = useState(null);
  const dragRef = useRef(null);
  const ansTypes = [
    { val: "any", text: "Anything" },
    { val: "name", text: "Name (a - z A - Z)" },
    { val: "email", text: "Email" },
    { val: "mobile", text: "Mobile (10 Digit)" },
    { val: "number", text: "Number (0 - 9)" },
    { val: "date", text: "Date (YYYY-MM-DD)" },
    { val: "time", text: "Time (HH:MM am/pm)" },
  ];

  if (!selected?.key) {
    warning("Select node for add child node");
    dispatch(addModel({ open: false }));
  } else if (selected?.type === "list") {
    warning("You can't add child node in list");
    dispatch(addModel({ open: false }));
  }

  // File Input
  const onDragEnter = () => {
    dragRef.current.classList.add("active");
  };
  const onDragLeave = () => {
    dragRef.current.classList.remove("active");
  };
  const onDropRejected = (e) => {
    e.map((f) => {
      if (f.errors[0].code === "file-too-large") {
        error(
          `${f.file.name} is larger than ${
            ["image", "gallery"].includes(widgetType) ? 2 : 10
          } mb`
        );
      } else if (f.errors[0].code === "file-invalid-type") {
        error(`${f.file.name} is rejected. ${f.errors[0].message}`);
      } else {
        error("🚀 - error:", f);
      }
    });
  };

  const onDrop = async (acceptedFiles) => {
    onDragLeave();

    try {
      const fd = new FormData();
      acceptedFiles.forEach((file) => fd.append("file", file));
      const res = await uploadWidget(widgetType, params.id, fd);
      const arr = res.data?.files || [];
      setFiles([
        ...files,
        ...arr.map((e) => {
          e.preview = getPreviewImg(e);
          return e;
        }),
      ]);
    } catch (err) {
      error(err);
    }
  };

  const getPreviewImg = (file) => {
    let url;
    if (["image", "gallery"].includes(widgetType)) {
      url = file.name;
    } else if (widgetType === "video") {
      url = "video.png";
    } else if (widgetType === "file") {
      const ext = file.name.split(".").pop();
      if (ext === "xls" || ext === "xlsx") {
        url = "excel.png";
      } else if (ext === "doc" || ext === "docx") {
        url = "word.png";
      } else if (ext === "pdf") {
        url = "pdf.png";
      }
    }
    return url;
  };

  const config = {
    onDragEnter: onDragEnter,
    onDragLeave: onDragLeave,
    onDropRejected: onDropRejected,
    onDrop: onDrop,
    maxSize: ["image", "gallery"].includes(widgetType) ? 2000000 : 10000000,
  };

  if (["image", "gallery"].includes(widgetType)) {
    config.accept = {
      "image/*": [".png", ".jpg", ".jpeg"],
    };
  } else if (widgetType === "video") {
    config.accept = {
      "video/*": [".mp4", ".mkv"],
    };
  } else if (widgetType === "file") {
    config.accept = {
      "application/pdf": [".xls", ".doc", ".xlsx", ".docx", ".pdf"],
    };
  }

  const { getRootProps, getInputProps } = useDropzone(config);

  const removeFile = (index) => {
    setFiles(
      files.filter((f, i) => {
        if (i === index) {
          return false;
        }
        return true;
      })
    );
  };

  // Common stuff for all type

  const setValues = (val, key) => {
    setValue({ ...value, [key]: val });
  };

  const setBtnValue = (val, index) => {
    setBtnList(
      btnList.map((btn, i) => {
        if (i === index) {
          btn.mes = val;
        }
        return btn;
      })
    );
  };

  const setFieldValue = (val, index, key) => {
    setFieldList(
      fieldList.map((field, i) => {
        if (i === index) {
          field[key] = val;
        }
        return field;
      })
    );
  };

  const handleAddButton = () => {
    let key = Math.round(Math.random() * 1000000);
    setBtnList([...btnList, { key, type: "option", mes: "" }]);
  };

  const removeButton = (index) => {
    setBtnList(btnList.filter((btn, i) => i !== index));
  };

  const handleAddField = () => {
    let key = Math.round(Math.random() * 1000000);
    setFieldList([...fieldList, { key, type: ansTypes[0].val, title: "" }]);
  };

  const handleRemoveField = (index) => {
    setFieldList(fieldList.filter((f, i) => i !== index));
  };

  const handleVerifyURL = async () => {
    if (!isURL(value?.url)) {
      error("Invalid URL");
      return;
    }
    try {
      let params = {};
      paramsList.map((item) => {
        params[item.key] = item.defaultValue;
      });
      const res = await axios.get(value.url, { params });
      const data = res.data;
      if (
        /* data?.success &&  */ data?.products &&
        Array.isArray(data.products)
      ) {
        success("API Verified 🎉");
        setResponse(data);
        return;
      }
      throw "Invalid Response";
    } catch (err) {
      error(err?.message || "Invalid Response");
    }
  };

  const handleAddWidget = () => {
    const data = {
      type: widgetType,
    };

    data.save = saveRes ? attribute : false;

    if (widgetType === "text") {
      if (value?.mes) {
        dispatch(
          addNew({
            mes: value?.mes,
            ...data,
          })
        );
      } else {
        error("Please enter message");
      }
    } else if (widgetType === "question") {
      if (value?.mes) {
        dispatch(
          addNew({
            mes: value?.mes,
            valid: value?.ansType || ansTypes[0].val,
            ...data,
          })
        );
      } else {
        error("Please enter question");
      }
    } else if (widgetType === "list") {
      if (value?.mes) {
        if (btnList.filter((ele) => ele.mes !== "").length > 0) {
          dispatch(
            addNew({
              mes: value?.mes,
              opt: btnList.filter((ele) => ele.mes !== ""),
              ...data,
            })
          );
        } else {
          error("Atleast one option required");
        }
      } else {
        error("Please enter question");
      }
    } else if (widgetType === "url") {
      if (isURL(value?.mes)) {
        dispatch(
          addNew({
            mes: value?.mes,
            ...data,
          })
        );
      } else {
        error("Invalid URL");
      }
    } else if (["image", "gallery", "video", "file"].includes(widgetType)) {
      if (files.length > 0) {
        dispatch(
          addNew({
            mes: `${files.length} ${widgetType}`,
            files: files,
            ...data,
          })
        );
      } else {
        error(`Please select ${widgetType}`);
      }
    } else if (widgetType === "form") {
      if (fieldList.length === 0) {
        error("Please enter button text");
      } else if (!value?.mes) {
        error("Please enter message");
      } else if (!value?.btnText) {
        error(`Atleast one field required`);
      } else
        dispatch(
          addNew({
            mes: value?.mes,
            fields: fieldList,
            btnText: value?.btnText,
            ...data,
          })
        );
    } else if (widgetType === "product") {
      if (isURL(value?.url)) {
        response
          ? dispatch(
              addNew({
                mes: "Product Slider",
                url: value?.url,
                params: paramsList,
                ...data,
              })
            )
          : error("Verify first");
      } else {
        error("Invalid URL");
      }
    } else if (widgetType === "liveChat") {
      if (value?.mes) {
        dispatch(
          addNew({
            mes: value?.mes,
            opt: [
              {
                key: Math.round(Math.random() * 1000000),
                type: "option",
                mes: "Yes",
              },
              {
                key: Math.round(Math.random() * 1000000),
                type: "option",
                mes: "No",
              },
            ],
            ...data,
          })
        );
      } else {
        error("Please enter message");
      }
    } else if (widgetType === "jump") {
      if (value?.target) {
        dispatch(
          addNew({
            target: value?.target,
            ...data,
          })
        );
      } else {
        error("Please enter target key");
      }
    }
  };

  const handleAddAttribute = (val) => {
    saveAttr(dispatch, { botId: params?.id, attr: [...attributes, val] });
    setAttrModelOpen(false);
  };

  const addParams = () => {
    setParamsList([...paramsList, { key: "", value: "", defaultValue: "" }]);
  };

  const setParamsValue = (index, key, val) => {
    setParamsList(
      paramsList.map((ele, i) => {
        if (i === index) {
          ele[key] = val;
        }
        return ele;
      })
    );
  };

  const removeParams = (index) => {
    setParamsList(paramsList.filter((f, i) => i !== index));
  };

  const AttributeModel = ({ setAttrModelOpen, handleAddAttribute }) => {
    const [newAttr, setNewAttr] = useState("");
    return (
      <div className="model-container">
        <div className="model-wrap" style={{ width: 300 }}>
          <Button
            className="model-close-btn"
            variant="contained"
            onClick={() => setAttrModelOpen(false)}
          >
            {icons.close}
          </Button>
          <div className="model-header">
            <h4>Add Attribute</h4>
          </div>
          <div className="model-body">
            <div className="model-input-wrap">
              <TextField
                className="model-input-ele w-100"
                label="Enter Attribute"
                variant="outlined"
                size="small"
                autoFocus={true}
                onChange={(e) => setNewAttr(e.target.value)}
              />
            </div>
          </div>
          <div className="model-footer">
            <Button
              variant="contained"
              className="model-submit-btn"
              onClick={() => handleAddAttribute(newAttr)}
            >
              Add Attribute
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="model-container">
      <div className="model-wrap">
        <Button
          className="model-close-btn"
          variant="contained"
          onClick={() => dispatch(addModel({ open: false }))}
        >
          {icons.close}
        </Button>
        <div className="model-header">
          <h4>{widgetType} Widget</h4>
        </div>
        <div className="model-body">
          {widgetType === "text" && (
            <div className="model-input-wrap">
              <TextField
                multiline
                rows={3}
                className="model-input-ele w-100"
                label="Enter Message"
                variant="outlined"
                size="small"
                autoFocus={true}
                onChange={(e) => setValues(e.target.value, "mes")}
              />
            </div>
          )}

          {widgetType === "question" && (
            <div className="model-input-wrap">
              <TextField
                multiline
                rows={3}
                className="model-input-ele w-100"
                label="Enter Question"
                variant="outlined"
                size="small"
                autoFocus={true}
                onChange={(e) => setValues(e.target.value, "mes")}
              />
              <TextField
                select
                className="model-input-ele"
                label="Answer Type"
                size="small"
                defaultValue={ansTypes[0].val}
                onChange={(e) => setValues(e.target.value, "ansType")}
              >
                {ansTypes.map((t, i) => {
                  return (
                    <MenuItem key={i} value={t.val}>
                      {t.text}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
          )}

          {widgetType === "list" && (
            <>
              <div className="model-input-wrap">
                <TextField
                  multiline
                  rows={3}
                  className="model-input-ele w-100"
                  label="Enter Question"
                  variant="outlined"
                  size="small"
                  autoFocus={true}
                  onChange={(e) => setValues(e.target.value, "mes")}
                />
              </div>
              <Button
                variant="contained"
                className="m-2"
                onClick={handleAddButton}
              >
                Add Option
              </Button>
              <div className="model-input-wrap">
                {btnList.map((btn, i) => (
                  <div className="model-input-btn-ele mt-1 mb-1" key={i}>
                    <TextField
                      className="w-100"
                      label="Enter Option Text"
                      variant="outlined"
                      size="small"
                      value={btn?.mes}
                      autoFocus={i === btnList.length - 1}
                      onChange={(e) => setBtnValue(e.target.value, i)}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => removeButton(i)}
                    >
                      {icons.close}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {widgetType === "url" && (
            <div className="model-input-wrap">
              <TextField
                className="model-input-ele w-100"
                label="Enter URL"
                variant="outlined"
                size="small"
                autoFocus={true}
                onChange={(e) => setValues(e.target.value, "mes")}
              />
            </div>
          )}

          {["image", "gallery", "video", "file"].includes(widgetType) && (
            <>
              <div {...getRootProps({ className: "m-dropzone" })} ref={dragRef}>
                <input {...getInputProps()} />
                Drag and drop files here, or click to select files
              </div>
              <div className="m-p-con">
                <h5>Preview</h5>
                <div className="m-p-wrap">
                  {files.length > 0 ? (
                    files.map((file, i) => (
                      <div className="m-p-item" key={i} title={file.orgName}>
                        <div
                          className="m-p-i-delete-btn"
                          onClick={() => removeFile(i)}
                        >
                          {icons.close}
                        </div>
                        <a
                          href={`${process.env.REACT_APP_API}/bot/static/widget/${file.name}`}
                          target="_blank"
                        >
                          <div className="m-p-img-con">
                            <img
                              src={`${process.env.REACT_APP_API}/bot/static/widget/${file.preview}`}
                            />
                          </div>
                        </a>
                        <div className="m-p-img-name">{file.orgName}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-files">No files to preview</div>
                  )}
                </div>
              </div>
            </>
          )}

          {widgetType === "form" && (
            <>
              <div className="model-input-wrap mb-2">
                <TextField
                  multiline
                  rows={2}
                  className="model-input-ele w-100"
                  label="Enter Form Title"
                  variant="outlined"
                  size="small"
                  autoFocus={true}
                  onChange={(e) => setValues(e.target.value, "mes")}
                />
                <TextField
                  className="model-input-ele w-75"
                  label="Enter Submit Button Text"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setValues(e.target.value, "btnText")}
                />
                <Button
                  variant="contained"
                  className="ml-2"
                  onClick={handleAddField}
                >
                  Add Field
                </Button>
              </div>

              <div className="model-input-wrap">
                {fieldList.map((field, i) => (
                  <div className="model-input-btn-ele mt-1 mb-1 w-100" key={i}>
                    <TextField
                      className="mr-2 w-75"
                      label="Enter Field Title"
                      variant="outlined"
                      size="small"
                      value={field?.title}
                      autoFocus={i === fieldList.length - 1}
                      onChange={(e) =>
                        setFieldValue(e.target.value, i, "title")
                      }
                    />
                    <TextField
                      select
                      className="w-25"
                      label="Answer Type"
                      size="small"
                      value={field?.type || ansTypes[0].val}
                      onChange={(e) => setFieldValue(e.target.value, i, "type")}
                    >
                      {ansTypes.map((t, i) => {
                        return (
                          <MenuItem key={i} value={t.val}>
                            {t.text}
                          </MenuItem>
                        );
                      })}
                    </TextField>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleRemoveField(i)}
                    >
                      {icons.close}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {widgetType === "product" && (
            <div className="model-input-wrap">
              <TextField
                multiline
                rows={3}
                className="model-input-ele w-100"
                label="Enter API URL"
                variant="outlined"
                size="small"
                autoFocus={true}
                onChange={(e) => {
                  response && setResponse(null);
                  setValues(e.target.value, "url");
                }}
              />
              <div className="w-100">
                Note: Response data keys must be same as example response.
              </div>
              <div className="w-100">
                {paramsList.map((item, i) => (
                  <div
                    key={i}
                    className="w-100 d-flex flex-wrap"
                    style={{ gap: 10, marginBottom: 10 }}
                  >
                    <div className="p-widget-params">
                      <TextField
                        className=""
                        label="Enter Parameter Key"
                        variant="outlined"
                        size="small"
                        value={item.key}
                        onChange={(e) => {
                          setParamsValue(i, "key", e.target.value);
                        }}
                      />
                      <TextField
                        className=""
                        label="Enter Parameter Default Value"
                        variant="outlined"
                        size="small"
                        value={item.defaultValue}
                        onChange={(e) => {
                          setParamsValue(i, "defaultValue", e.target.value);
                        }}
                      />
                      <TextField
                        select
                        style={{ flexGrow: 1 }}
                        label="Value From Attribute"
                        size="small"
                        value={item.value}
                        defaultValue={""}
                        onChange={(e) =>
                          setParamsValue(i, "value", e.target.value)
                        }
                      >
                        <MenuItem value="">Select Value</MenuItem>
                        {attributes.map((a, i) => (
                          <MenuItem value={a} key={i}>
                            {a}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => removeParams(i)}
                    >
                      {icons.close}
                    </Button>
                  </div>
                ))}
                <Button variant="contained" size="small" onClick={addParams}>
                  Add Parameter
                </Button>
              </div>
              <Button
                variant="contained"
                size="small"
                onClick={handleVerifyURL}
                color={response ? "success" : "primary"}
              >
                {response ? "Verified" : "Verify"}
              </Button>
              <div className="d-flex w-100">
                <div
                  className="w-50 overflow-auto px-2"
                  style={{ maxHeight: "100vh" }}
                >
                  <h5>Response Example</h5>
                  <ReactJson
                    src={sample || {}}
                    indentWidth={2}
                    displayDataTypes={false}
                    collapseStringsAfterLength={true}
                    collapsed={true}
                    enableClipboard={false}
                  />
                </div>
                <div style={{ borderLeft: "1px solid lightgray" }}></div>
                <div
                  className="w-50 overflow-auto px-2"
                  style={{ maxHeight: "100vh" }}
                >
                  <h5>Your API Response</h5>
                  <ReactJson
                    src={response || {}}
                    indentWidth={2}
                    displayDataTypes={false}
                    collapseStringsAfterLength={true}
                    collapsed={true}
                    enableClipboard={false}
                  />
                </div>
              </div>
            </div>
          )}

          {widgetType === "liveChat" && (
            <div className="model-input-wrap">
              <TextField
                multiline
                rows={3}
                className="model-input-ele w-100"
                label="Enter Message"
                variant="outlined"
                size="small"
                autoFocus={true}
                onChange={(e) => setValues(e.target.value, "mes")}
              />
            </div>
          )}

          {widgetType === "jump" && (
            <div className="model-input-wrap">
              <TextField
                className="model-input-ele w-100"
                label="Enter Target key"
                variant="outlined"
                size="small"
                autoFocus={true}
                onChange={(e) => setValues(e.target.value, "target")}
              />
            </div>
          )}
        </div>
        <div className="model-footer">
          {["question", "list"].includes(widgetType) && (
            <>
              <FormGroup className="save-checkbox">
                <FormControlLabel
                  control={
                    <Checkbox onChange={(e) => setSaveRes(e.target.checked)} />
                  }
                  label="Save response to attribute"
                />
              </FormGroup>
              <div className="attribute-con">
                <TextField
                  select
                  className="attr-select"
                  label="Attribute"
                  size="small"
                  defaultValue={attributes[0] || ""}
                  disabled={!saveRes}
                  onChange={(e) => setAttribute(e.target.value)}
                >
                  {attributes.map((a, i) => (
                    <MenuItem value={a} key={i}>
                      {a}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  className="model-attr-add-btn"
                  onClick={() => setAttrModelOpen(true)}
                >
                  {icons.add}
                </Button>
              </div>
            </>
          )}
          <Button
            variant="contained"
            className="model-submit-btn"
            onClick={handleAddWidget}
          >
            Add Widget
          </Button>
        </div>
      </div>

      {attrModelOpen && (
        <AttributeModel
          setAttrModelOpen={setAttrModelOpen}
          handleAddAttribute={handleAddAttribute}
        />
      )}
    </div>
  );
}

export default AddModel;
