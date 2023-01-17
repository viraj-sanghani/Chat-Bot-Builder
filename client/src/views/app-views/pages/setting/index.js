import React, { Component } from "react";
import { UserOutlined, LockOutlined, DesktopOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link, Route, Switch } from "react-router-dom";
import InnerAppLayout from "layouts/inner-app-layout";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
// import Monitoring from "./Monitoring";

const SettingOption = ({ match }) => {
  return (
    <Menu
      defaultSelectedKeys={`${match.url}/edit-profile`}
      mode="inline"
      selectedKeys={`${match.url}/${match.params.type}`}
    >
      <Menu.Item key={`${match.url}/edit-profile`}>
        <UserOutlined />
        <span>Edit Profile</span>
        <Link to={{ pathname: "edit-profile" }} />
      </Menu.Item>
      <Menu.Item key={`${match.url}/change-password`}>
        <LockOutlined />
        <span>Change Password</span>
        <Link to={{ pathname: "change-password" }} />
      </Menu.Item>
      {/* <Menu.Item key={`${match.url}/monitoring`}>
        <DesktopOutlined />
        <span>Monitoring Settings</span>
        <Link to={{ pathname: "monitoring" }} />
      </Menu.Item> */}
    </Menu>
  );
};

const SettingContent = ({ match }) => {
  const getSettingComponent = () => {
    const val = match.params.type;
    switch (val) {
      case "edit-profile":
        return EditProfile;
      case "change-password":
        return ChangePassword;
      /* case "monitoring":
        return Monitoring; */
      default:
        return EditProfile;
    }
  };

  return (
    <Switch>
      <Route path={`${match.url}`} component={getSettingComponent()} />
    </Switch>
  );
};

export class Setting extends Component {
  render() {
    return (
      <InnerAppLayout
        sideContentWidth={320}
        sideContent={<SettingOption {...this.props} />}
        mainContent={<SettingContent {...this.props} />}
      />
    );
  }
}

export default Setting;
