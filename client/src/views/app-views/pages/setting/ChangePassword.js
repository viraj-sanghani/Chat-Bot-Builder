import React, { Component } from "react";
import { Form, Button, Input, Row, Col, message } from "antd";
import { call, changePassword } from "redux/axios";
import { error, success } from "components/shared-components/Toast/Toast";

export class ChangePassword extends Component {
  changePasswordFormRef = React.createRef();

  onFinish = async (data) => {
    try {
      await call(
        changePassword({ oldPass: data.oldPass, newPass: data.newPass })
      );
      this.onReset();
      success("Your password has been changed.");
    } catch (err) {
      error(err);
    }
  };

  onReset = () => {
    this.changePasswordFormRef.current.resetFields();
  };

  render() {
    return (
      <>
        <h2 className="mb-4">Change Password</h2>
        <Row>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Form
              name="changePasswordForm"
              layout="vertical"
              ref={this.changePasswordFormRef}
              onFinish={this.onFinish}
            >
              <Form.Item
                label="Current Password"
                name="oldPass"
                rules={[
                  {
                    required: true,
                    message: "Please enter your currrent password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
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
                      if (!value || getFieldValue("newPass") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Password not matched!");
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Change password
              </Button>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}

export default ChangePassword;
