import "./Bot.css";
import React, { useEffect, useState } from "react";
import { Form, Input, Radio, Button, Upload, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { call, botAdd } from "redux/axios";
import { success, error } from "components/shared-components/Toast/Toast";
import { Colorpicker, ColorPickerValue } from "antd-colorpicker";
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { xs: { span: 14 }, sm: { span: 10 } },
};

const tailFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14, offset: 6 },
};

const Add = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [background, setBackground] = useState("#093351");
  const [picker, setPicker] = useState(false);

  const onFinish = async (data) => {
    try {
      data.background = background;
      data.icon = picture ? picture.file : false;

      const fd = new FormData();
      for (var key in data) {
        fd.append(key, data[key]);
      }

      const r = await call(botAdd(fd));
      form.resetFields();
      setPicker("");
      setImageUrl("");
      success("Bot added successfully");
    } catch (err) {
      error(err);
    }
  };

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

  const colorChange = (val) => {
    setBackground(val.hex);
  };

  return (
    <>
      <h3>Bot Add</h3>
      <Form
        className="mt-3"
        {...formItemLayout}
        form={form}
        name="add-bot"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={{ align: "Right", infoForm: 1, liveChat: 1 }}
      >
        <Form.Item
          name="botName"
          label="Bot Name"
          rules={[{ required: true, message: "Please enter bot name/title!" }]}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="background" label="Background">
          <>
            <div
              className="color-picker-box"
              onClick={() => setPicker(!picker)}
              style={{ background: background }}
            ></div>
            {picker && (
              <div className="color-picker-wrap">
                <Colorpicker onChange={colorChange} value={background} />
              </div>
            )}
          </>
        </Form.Item>

        <Form.Item name="icon" label="Icon">
          <div style={{ display: "flex", gap: "15px" }}>
            {/* <div
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
              </div> */}
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

        <Form.Item name="align" label="Position">
          <Radio.Group>
            <Radio value="Right">Right</Radio>
            <Radio value="Left">Left</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="infoForm" label="Info Form">
          <Radio.Group>
            <Radio value={1}>Enabled</Radio>
            <Radio value={0}>Disabled</Radio>
          </Radio.Group>
        </Form.Item>

        {/* <Form.Item name="liveChat" label="Live Chat">
          <Radio.Group>
            <Radio value={1}>Enabled</Radio>
            <Radio value={0}>Disabled</Radio>
          </Radio.Group>
        </Form.Item> */}

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Add Bot
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Add;
