import React, { useEffect } from "react";
import { connect } from "react-redux";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Alert, Row, Col } from "antd";
import { signUp, setLoading } from "redux/actions/Auth";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { PersonOutline } from "@mui/icons-material";

const rules = {
  email: [
    {
      required: true,
      message: "Please input your email address",
    },
    {
      type: "email",
      message: "Please enter a validate email!",
    },
  ],
  mobile: [
    {
      required: true,
      message: "Please input your mobile number",
    },
  ],
  fname: [
    {
      required: true,
      message: "Please input your first name",
    },
  ],
  lname: [
    {
      required: true,
      message: "Please input your last name",
    },
  ],
  address: [
    {
      required: true,
      message: "Please input your address",
    },
  ],
  pincode: [
    {
      required: true,
      message: "Please input your pincode",
    },
  ],
  city: [
    {
      required: true,
      message: "Please input your city",
    },
  ],
  cname: [
    {
      required: true,
      message: "Please input your company name",
    },
  ],
  password: [
    {
      required: true,
      message: "Please input your password",
    },
  ],
};

export const RegisterForm = (props) => {
  const { signUp, token, loading, redirect, message, allowRedirect } = props;
  const [form] = Form.useForm();
  let history = useHistory();

  const onSignUp = (values) => {
    signUp(values);
  };

  useEffect(() => {
    redirect && history.push("/");
  }, [redirect]);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="register-form"
        onFinish={onSignUp}
      >
        <Row gutter={24}>
          <Col className="gutter-row" span={12}>
            <Form.Item name="firstName" label="First Name" rules={rules.fname}>
              <Input /* prefix={<PersonOutline className="text-primary" />} */
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item name="lastName" label="Last Name" rules={rules.lname}>
              <Input /* prefix={<PersonOutline className="text-primary" />} */
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item name="email" label="Email" rules={rules.email}>
              <Input prefix={<MailOutlined className="text-primary" />} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item name="password" label="Password" rules={rules.password}>
              <Input.Password
                prefix={<LockOutlined className="text-primary" />}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item name="mobile" label="Mobile" rules={rules.mobile}>
              <Input /* prefix={<PersonOutline className="text-primary" />} */
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item name="address" label="Address" rules={rules.address}>
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item name="pinCode" label="Pincode" rules={rules.pincode}>
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item name="city" label="City" rules={rules.city}>
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={rules.cname}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const mapStateToProps = ({ auth }) => {
  const { loading, token, redirect } = auth;
  return { loading, token, redirect };
};

const mapDispatchToProps = {
  signUp,
  setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
