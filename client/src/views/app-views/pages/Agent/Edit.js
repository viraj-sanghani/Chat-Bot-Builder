import React, { useEffect, useState } from "react";

import { Form, Input, Radio, Button, Upload, message, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { call, agentInfo, agentUpdate } from "redux/axios";
import { success, error } from "components/shared-components/Toast/Toast";
import axios from "axios";
import { AUTH_TOKEN } from "redux/constants/Auth";
import Utils from "utils";
import { useHistory } from "react-router-dom";
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { xs: { span: 14 }, sm: { span: 10 } },
};

const tailFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14, offset: 6 },
};

const Edit = (props) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [agent, setAgent] = useState({});
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchAgent = async () => {
    try {
      const r = await call(agentInfo({ id: props.match.params.id }));
      setAgent(r.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAgent();
  }, []);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      error("Image must smaller than 2MB!");
    }
    return false;
  };

  const handleChange = (info) => {
    setLoading(true);
    setPicture(info);
    getBase64(info.file, (imageUrl) => {
      setLoading(false);
      setImageUrl(imageUrl);
    });
    return;
  };

  const onFinish = async (data) => {
    if (!data.mobile.match(/^\d{10}$/)) {
      error("Invalid phone number");
      return;
    }

    const pic = picture ? picture.file : false;

    delete data.picture;

    try {
      const id = props.match.params.id;
      const r = await call(agentUpdate({ ...data, id }));

      if (pic) {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("picture", pic);

        axios({
          method: "put",
          url: process.env.REACT_APP_API + "/api/agent/edit",
          data: fd,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
          },
        })
          .then((res) => {
            if (res.data.success) {
              success("Changes save successfully");
              history.push({ pathname: "../../agents" });
            } else error(res.data.message);
          })
          .catch(function (err) {
            error("Something went wrong");
          });
      } else {
        success("Changes save successfully");

        history.push({ pathname: "../../agents" });
      }
    } catch (err) {
      error(err.message);
    }
  };

  return (
    <>
      <h3>Agent Edit</h3>
      {agent?.firstName && (
        <Form
          className="mt-3"
          {...formItemLayout}
          form={form}
          name="edit-agent"
          onFinish={onFinish}
          initialValues={{
            firstName: agent?.firstName,
            lastName: agent?.lastName,
            email: agent?.email,
            mobile: agent?.mobile.toString(),
            gender: agent?.gender,
            isBlock: agent?.isBlock,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "Invalid e-mail!",
              },
              {
                required: true,
                message: "Please enter e-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="gender" label="Gender">
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="picture" label="Picture">
            <div style={{ display: "flex", gap: "15px" }}>
              <div
                style={{
                  minWidth: "100px",
                  minHeight: "100px",
                  maxWidth: "100px",
                  maxHeight: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "1px 2px 5px rgba(0,0,0,.1)",
                }}
              >
                <img
                  src={
                    agent?.picture
                      ? Utils.avatar(agent.picture)
                      : Utils.avatarDefault(agent.gender)
                  }
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <Upload
                name="picture"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                fileList={[]}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div className="ant-upload-text">Upload</div>
                  </div>
                )}
              </Upload>
            </div>
          </Form.Item>

          <Form.Item name="isBlock" label="Status">
            <Select
              showSearch
              placeholder="Select a status"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value={false}>Active</Option>
              <Option value={true}>Block</Option>
            </Select>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default Edit;
