import React, { Component } from "react";
import { Row, Col, Card, Avatar, Button } from "antd";
import { Icon } from "components/util-components/Icon";
import {
  GlobalOutlined,
  MailOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import Flex from "components/shared-components/Flex";
import { call, agentInfo } from "redux/axios";
import { Link } from "react-router-dom";
import Utils from "utils";

const employementList = [],
  interestedList = [],
  connectionList = [],
  groupList = [];

const ProfileInfo = (props) => (
  <Card>
    <Row justify="center">
      <Col sm={24} md={23}>
        <div className="d-md-flex">
          <div
            className="rounded p-2 bg-white shadow-sm mx-auto"
            style={{
              marginTop: "-3.5rem",
              maxWidth: `${props.avatarSize + 16}px`,
              maxHeight: `${props.avatarSize + 16}px`,
            }}
          >
            <Avatar
              shape="square"
              size={props.avatarSize}
              src={
                props?.picture
                  ? Utils.avatar(props.picture)
                  : Utils.avatarDefault(props.gender)
              }
            />
          </div>
          <div className="ml-md-4 w-100">
            <Flex
              alignItems="center"
              mobileFlex={false}
              className="mb-3 text-md-left text-center"
            >
              <h2 className="mb-0 mt-md-0 mt-2">{props?.fullName}</h2>
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
                    <a
                      target="_blank"
                      className=""
                      href={`mailto:${props?.email}`}
                    >
                      {props?.email}
                    </a>
                  </span>
                </Row>
                <Row className="mb-2">
                  <Icon
                    type={PhoneOutlined}
                    className="text-primary font-size-md"
                  />
                  <span className="text-muted ml-2">Phone :</span>
                  <span className="font-weight-semibold ml-2">
                    <a
                      target="_blank"
                      className=""
                      href={`tel:${props?.mobile}`}
                    >
                      {props?.mobile}
                    </a>
                  </span>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Row className="mb-2">
                  <Icon
                    type={PersonOutlineOutlinedIcon}
                    className="text-primary font-size-md"
                  />
                  <span className="text-muted ml-2">Gender :</span>
                  <span className="font-weight-semibold ml-2">
                    {props?.gender}
                  </span>
                </Row>
                <Row className="mb-2">
                  <Icon
                    type={DesktopWindowsOutlinedIcon}
                    className="text-primary font-size-md"
                  />
                  <span className="text-muted ml-2">Status :</span>
                  <span className="font-weight-semibold ml-2">
                    {!props?.isBlock ? "Active" : "Blocked"}
                  </span>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    </Row>
  </Card>
);

const Experiences = () => (
  <Card title="Experiences">
    <div className="mb-3">
      <Row>
        <Col sm={24} md={22}>
          {employementList.map((elm, i) => {
            return (
              <div
                className={`${i === employementList.length - 1 ? "" : "mb-4"}`}
                key={`eduction-${i}`}
              >
                <AvatarStatus
                  src={elm.img}
                  name={elm.title}
                  subTitle={elm.duration}
                />
                <p className="pl-5 mt-2 mb-0">{elm.desc}</p>
              </div>
            );
          })}
        </Col>
      </Row>
    </div>
  </Card>
);

const Interested = () => (
  <Card title="Interested">
    <Row gutter={30}>
      <Col sm={24} md={12}>
        {interestedList
          .filter((_, i) => i < 4)
          .map((elm, i) => {
            return (
              <div className="mb-3" key={`interested-${i}`}>
                <h4 className="font-weight-semibold">{elm.title}</h4>
                <p>{elm.desc}</p>
              </div>
            );
          })}
      </Col>
      <Col sm={24} md={12}>
        {interestedList
          .filter((_, i) => i >= 4)
          .map((elm, i) => {
            return (
              <div className="mb-3" key={`interested-${i}`}>
                <h4 className="font-weight-semibold">{elm.title}</h4>
                <p>{elm.desc}</p>
              </div>
            );
          })}
      </Col>
    </Row>
  </Card>
);

const Connection = () => (
  <Card title="Connection">
    {connectionList.map((elm, i) => {
      return (
        <div
          className={`${i === connectionList.length - 1 ? "" : "mb-4"}`}
          key={`connection-${i}`}
        >
          <AvatarStatus src={elm.img} name={elm.name} subTitle={elm.title} />
        </div>
      );
    })}
  </Card>
);

const Group = () => (
  <Card title="Group">
    {groupList.map((elm, i) => {
      return (
        <div
          className={`${i === groupList.length - 1 ? "" : "mb-4"}`}
          key={`connection-${i}`}
        >
          <AvatarStatus src={elm.img} name={elm.name} subTitle={elm.desc} />
        </div>
      );
    })}
  </Card>
);

export class Profile extends Component {
  state = {
    agent: "",
  };

  componentDidMount = async (props) => {
    try {
      const id = this.props.match.params.agent_id;
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
        <div className="container my-4">
          {this.state.agent && (
            <ProfileInfo {...this.state.agent} avatarSize={avatarSize} />
          )}
          <Row gutter="16">
            <Col xs={24} sm={24} md={8}>
              <Connection />
              <Group />
            </Col>
            <Col xs={24} sm={24} md={16}>
              <Experiences />
              <Interested />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Profile;
