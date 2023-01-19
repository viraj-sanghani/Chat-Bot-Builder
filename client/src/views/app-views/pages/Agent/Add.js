import React, { useEffect, useState } from "react";

import { Form, Input, Radio, Button, Upload, Select } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { call, agentAdd } from "redux/axios";
import { success, error } from "components/shared-components/Toast/Toast";
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

  const onFinish = async (data) => {
    if (!data.mobile.match(/^\d{10}$/)) {
      return error("Invalid phone number");
    }

    try {
      const r = await call(agentAdd(data));
      form.resetFields();
      success("Agent added successfully");
    } catch (err) {
      error(err);
    }
  };

  return (
    <>
      <h3>Agent Add</h3>
      <Form
        className="mt-3"
        {...formItemLayout}
        form={form}
        name="add-agent"
        onFinish={onFinish}
        initialValues={{
          gender: "male",
          isBlock: false,
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

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please enter password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="gender" label="Gender">
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </Radio.Group>
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
            <Option value={0}>Active</Option>
            <Option value={1}>Block</Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Add Agent
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Add;
