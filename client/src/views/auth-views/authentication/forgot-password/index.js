import React, { useState } from "react";
import { Card, Row, Col, Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { call, forgotPassword } from "redux/axios";
import { error, success } from "components/shared-components/Toast/Toast";
import { Link } from "react-router-dom";

const backgroundStyle = {
  backgroundImage: "url(/img/others/img-17.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [linkSend, setLinkSend] = useState(false);

  const theme = useSelector((state) => state.theme.currentTheme);

  const onSend = async (values) => {
    try {
      setLoading(true);
      const res = await call(forgotPassword({ email: values.email }));
      success(res.message);
      setLinkSend(true);
    } catch (err) {
      error(err);
    }
    setLoading(false);
  };

  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col xs={20} sm={20} md={20} lg={9}>
            <Card>
              <div className="my-2">
                <div className="text-center">
                  <img
                    className="img-fluid"
                    src={`/img/${
                      theme === "light" ? "logo.png" : "logo-white.png"
                    }`}
                    alt=""
                  />
                  <h3 className="mt-3 font-weight-bold">
                    {!linkSend ? "Forgot Password?" : "Check your mail"}
                  </h3>
                  <p className="mb-4">
                    {!linkSend
                      ? "Enter the email associated with your account and we'll send an email with instructions to reset your password."
                      : "We have sent a password recover instructions to your email."}
                  </p>
                </div>
                <Row justify="center">
                  <Col xs={24} sm={24} md={20} lg={20}>
                    {!linkSend ? (
                      <Form
                        form={form}
                        layout="vertical"
                        name="forget-password"
                        onFinish={onSend}
                      >
                        <Form.Item
                          name="email"
                          rules={[
                            {
                              required: true,
                              message: "Please input your email address",
                            },
                            {
                              type: "email",
                              message: "Please enter a validate email!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Email Address"
                            prefix={<MailOutlined className="text-primary" />}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            loading={loading}
                            type="primary"
                            htmlType="submit"
                            block
                          >
                            {loading ? "Sending" : "Send"}
                          </Button>
                        </Form.Item>
                      </Form>
                    ) : (
                      <Link
                        to="./login"
                        className="m-auto d-block"
                        style={{ width: "fit-content" }}
                      >
                        <Button type="primary">Login</Button>
                      </Link>
                    )}
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ForgotPassword;
