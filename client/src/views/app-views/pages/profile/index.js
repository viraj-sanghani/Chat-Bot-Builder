import React, { Component } from "react";
import { Row, Col, Card, Avatar, Button } from "antd";
import { Icon } from "components/util-components/Icon";
import {
  GlobalOutlined,
  MailOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import Flex from "components/shared-components/Flex";
import { call, agentInfo } from "redux/axios";
import { AUTH_DATA } from "redux/constants/Auth";
import Utils from "utils";

export class Profile extends Component {
  state = {
    agent: "",
  };

  componentDidMount = async () => {
    try {
      const id = JSON.parse(localStorage.getItem(AUTH_DATA)).id;
      const r = await call(agentInfo({ id }));
      this.setState({ agent: r.data });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const avatarSize = 150;

    return (
      <>
        <PageHeaderAlt
          background="/img/others/img-12.jpg"
          cssClass="bg-primary"
          overlap
        >
          <div className="container text-center">
            <div className="py-5 my-md-5"></div>
          </div>
        </PageHeaderAlt>
        {this.state.agent && (
          <div className="container my-4">
            <Card>
              <Row justify="center">
                <Col sm={24} md={23}>
                  <div className="d-md-flex">
                    <div
                      className="rounded p-2 bg-white shadow-sm mx-auto"
                      style={{
                        marginTop: "-3.5rem",
                        maxWidth: `${avatarSize + 16}px`,
                        maxHeight: `${avatarSize + 16}px`,
                      }}
                    >
                      <Avatar
                        shape="square"
                        size={avatarSize}
                        src={
                          this.state.agent?.picture
                            ? Utils.avatar(this.state.agent.picture)
                            : Utils.avatarDefault(this.state.agent?.gender)
                        }
                      />
                    </div>
                    <div className="ml-md-4 w-100">
                      <Flex
                        alignItems="center"
                        mobileFlex={false}
                        className="mb-3 text-md-left text-center"
                      >
                        <h2 className="mb-0 mt-md-0 mt-2">
                          {this.state.agent.fullName}
                        </h2>
                      </Flex>
                      <Row gutter="16">
                        <Col xs={24} sm={24} md={12}>
                          <Row className="mb-2">
                            <Icon
                              type={MailOutlined}
                              className="text-primary font-size-md"
                            />
                            <span className="text-muted ml-2">Email :</span>
                            <span className="font-weight-semibold ml-2">
                              {this.state.agent.email}
                            </span>
                          </Row>
                          <Row>
                            <Icon
                              type={PhoneOutlined}
                              className="text-primary font-size-md"
                            />
                            <span className="text-muted ml-2">Phone :</span>
                            <span className="font-weight-semibold ml-2">
                              {this.state.agent.mobile}
                            </span>
                          </Row>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                          <Row className="mb-2 mt-2 mt-md-0 "></Row>
                          <Row className="mb-2"></Row>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </>
    );
  }
}

export default Profile;
