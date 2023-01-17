import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { call, resetPassword, forgotLinkvalid } from "redux/axios";
import { error, success } from "components/shared-components/Toast/Toast";
import { Link, useHistory } from "react-router-dom";

const backgroundStyle = {
  backgroundImage: "url(/img/others/img-17.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const ResetPassword = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(undefined);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const theme = useSelector((state) => state.theme.currentTheme);

  const validateToken = async () => {
    try {
      const res = await call(
        forgotLinkvalid({
          token: props.match.params?.token,
        })
      );
      setTokenValid(true);
    } catch (err) {
      setTokenValid(false);
      setMessage(err);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  const onSend = async (values) => {
    try {
      setLoading(true);
      const res = await call(
        resetPassword({
          password: values.newPass,
          token: props.match.params?.token,
        })
      );
      success(res.message);
      history.push({ pathName: "./login" });
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
              {tokenValid !== undefined && (
                <div className="my-2">
                  <div className="text-center">
                    <img
                      className="img-fluid"
                      src={`/img/${
                        theme === "light" ? "logo.png" : "logo-white.png"
                      }`}
                      alt=""
                    />
                    {tokenValid ? (
                      <>
                        <h3 className="mt-3 font-weight-bold">
                          Create new password
                        </h3>
                        <p className="mb-4">
                          Your new password must be different from previous used
                          passwords.
                        </p>
                      </>
                    ) : (
                      <h3 className="mt-3 font-weight-bold">{message}</h3>
                    )}
                  </div>
                  {tokenValid ? (
                    <Row justify="center">
                      <Col xs={24} sm={24} md={20} lg={20}>
                        <Form
                          form={form}
                          layout="vertical"
                          name="forget-password"
                          onFinish={onSend}
                        >
                          <Form.Item
                            label="New Password"
                            name="newPass"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your new password!",
                              },
                            ]}
                          >
                            <Input.Password />
                          </Form.Item>
                          <Form.Item
                            label="Confirm Password"
                            name="confirmPass"
                            rules={[
                              {
                                required: true,
                                message: "Please confirm your password!",
                              },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (
                                    !value ||
                                    getFieldValue("newPass") === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    "Password not matched!"
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password />
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
                      </Col>
                    </Row>
                  ) : (
                    <Link
                      to="../login"
                      className="m-auto d-block"
                      style={{ width: "fit-content" }}
                    >
                      <Button type="primary">Login</Button>
                    </Link>
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ResetPassword;
