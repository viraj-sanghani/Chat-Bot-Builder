import React, { Component } from "react";
import {
  Form,
  Avatar,
  Button,
  Input,
  Radio,
  DatePicker,
  Row,
  Col,
  message,
  Upload,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "constants/ThemeConstant";
import Flex from "components/shared-components/Flex";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { call, profileInfo, editProfile } from "redux/axios";
import { success, error } from "components/shared-components/Toast/Toast";
import axios from "axios";
import { AUTH_DATA, AUTH_TOKEN } from "redux/constants/Auth";
import Utils from "utils";
import { signInSuccess } from "redux/actions/Auth";

export class EditProfile extends Component {
  state = {
    agent: "",
    picture: "",
    imageUrl: "",
  };

  componentDidMount = async () => {
    try {
      const r = await call(profileInfo());
      this.setState({ agent: r.data });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const onRemoveAvater = () => {};

    const { firstName, lastName, email, mobile, gender, picture } =
      this.state?.agent;

    const getBase64 = (img, callback) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
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
      this.setState({ picture: info });
      getBase64(info.file, (imageUrl) => {
        this.setState({ imageUrl: imageUrl });
      });
      return;
    };

    const onFinish = async (data) => {
      if (!data.mobile.match(/^\d{10}$/)) {
        error("Invalid phone number");
        return;
      }
      const pic = this.state.picture ? this.state.picture.file : false;

      try {
        const r = await call(editProfile({ ...data }));
        if (pic) {
          const fd = new FormData();
          fd.append("picture", pic);

          axios({
            method: "put",
            url: process.env.REACT_APP_API + "/api/auth/editProfile",
            data: fd,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
          })
            .then((res) => {
              if (res.data.success) {
                success("Changes save successfully");
                localStorage.setItem(AUTH_DATA, JSON.stringify(res.data.data));
                signInSuccess(res.data.data, localStorage.getItem(AUTH_TOKEN));
              } else error(res.data.message);
            })
            .catch(function (err) {
              error("Something went wrong");
            });
        } else {
          success("Changes save successfully");
          localStorage.setItem(AUTH_DATA, JSON.stringify(r.data));
          signInSuccess(r.data, localStorage.getItem(AUTH_TOKEN));
        }
      } catch (err) {
        error(err.message);
      }
    };

    return (
      this.state.agent && (
        <>
          <Flex
            alignItems="center"
            mobileFlex={false}
            className="text-center text-md-left"
          >
            <Avatar
              size={90}
              src={
                this.state.imageUrl ||
                (this.state.agent?.picture
                  ? Utils.avatar(this.state.agent.picture)
                  : Utils.avatarDefault(this.state.agent.gender))
              }
              icon={<UserOutlined />}
            />
            <div className="ml-3 mt-md-0 mt-3">
              <Upload
                name="picture"
                showUploadList={false}
                fileList={[]}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                <Button type="primary">Change Picture</Button>
              </Upload>
              {/* <Button className="ml-2" onClick={onRemoveAvater}>
                Remove
              </Button> */}
            </div>
          </Flex>
          <div className="mt-4">
            <Form
              name="basicInformation"
              layout="vertical"
              initialValues={{
                firstName,
                lastName,
                email,
                mobile: mobile.toString(),
                gender,
              }}
              onFinish={onFinish}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={16}>
                  <Row gutter={ROW_GUTTER}>
                    <Col xs={24} sm={24} md={12}>
                      <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter first name!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter last name!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            type: "email",
                            message: "Please enter a valid email!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <Form.Item label="Phone Number" name="mobile">
                        <Input />
                      </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={24} md={12}>
                      <Form.Item label="Date of Birth" name="dob">
                        <DatePicker className="w-100" />
                      </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={24} md={12}>
                      <Form.Item name="gender" label="Gender">
                        <Radio.Group>
                          <Radio value="male">Male</Radio>
                          <Radio value="female">Female</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    {/* <Col xs={24} sm={24} md={24}>
                      <Form.Item label="Address" name="address">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <Form.Item label="City" name="city">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <Form.Item label="Pin Code" name="pin_code">
                        <Input />
                      </Form.Item>
                    </Col> */}
                  </Row>
                  <Button type="primary" htmlType="submit">
                    Save Change
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </>
      )
    );
  }
}

export default EditProfile;
