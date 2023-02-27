import "./Bot.css";
import React, { useEffect, useState } from "react";
import { Form, Input, Radio, Button, Upload, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { call, botMenuUpdate } from "redux/axios";
import { success, error } from "components/shared-components/Toast/Toast";
import { read, utils } from "xlsx";
import ReactJson from "react-json-view";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { xs: { span: 14 }, sm: { span: 10 } },
};

const tailFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14, offset: 6 },
};

const Edit = (props) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [jsonData, setJsonData] = useState({});

  const onFinish = async () => {
    if (jsonData?.botId) {
      try {
        await call(botMenuUpdate(jsonData));
        success("Menu Updated Successfully");
      } catch (err) {
        error(err);
      }
    } else {
      error("Excel not selected");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setLoading(true);
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);
        loadData(json);
        setLoading(false);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const loadData = (json) => {
    const d = { botId: parseInt(props.match.params.id), menu: [] };
    let q = null;
    json.forEach((j) => {
      if (j?.no) {
        if (q) {
          d.menu.push(q);
          q = null;
        }
        const m = {
          id: j?.no,
          mes: j?.message,
          next: j?.next || null,
          wait: j?.wait,
        };
        if (j?.valid) {
          m.valid = j.valid;
        }
        if (j?.start) {
          m.start = true;
        }
        if (j?.end) {
          m.end = true;
        }
        if (j?.mainMenu) {
          m.mainMenu = true;
        }
        if (j?.prevMenu) {
          m.prevMenu = true;
        }
        if (j?.liveChat) {
          m.liveChat = true;
        }
        if (j?.option) {
          q = m;
          q.opt = [];
        } else d.menu.push(m);
      } else {
        q.opt.push({
          val: j?.option,
          next: j?.next,
        });
      }
    });
    if (q) {
      d.menu.push(q);
      q = null;
    }
    setJsonData(d);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h3>Bot Menu Edit</h3>
        <a href="/botMenu.xlsx" download="/botMenu.xlsx">
          <Button type="primary">Download Sample</Button>
        </a>
      </div>
      <Form
        className="mt-3"
        {...formItemLayout}
        form={form}
        name="add-bot"
        onFinish={onFinish}
      >
        <Form.Item name="excel" label="Upload Excel">
          <div style={{ display: "flex", gap: "15px" }}>
            {/* <Upload
              name="picture"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              fileList={[]}
              onChange={handleChange}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">Upload</div>
              </div>
            </Upload> */}
            <input
              type="file"
              className=""
              id="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleChange}
            />
          </div>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Upload
          </Button>
        </Form.Item>
      </Form>

      <h4>Uploaded Data :</h4>
      <div>
        <ReactJson src={jsonData?.menu || {}} />
      </div>
    </>
  );
};

export default Edit;
