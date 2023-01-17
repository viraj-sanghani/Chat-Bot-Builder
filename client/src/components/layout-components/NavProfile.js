import React, { useState } from "react";
import { Menu, Dropdown, Avatar } from "antd";
import { onSwitchTheme } from "redux/actions/Theme";
import { connect } from "react-redux";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Icon from "components/util-components/Icon";
import { signOut } from "redux/actions/Auth";
import Alert from "components/shared-components/Alert/Alert";
import { success } from "components/shared-components/Toast/Toast";
import { Link, useHistory } from "react-router-dom";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { AUTH_DATA } from "redux/constants/Auth";
import Utils from "utils";

export const NavProfile = ({ signOut, currentTheme, onSwitchTheme }) => {
  const history = useHistory();
  const authData = JSON.parse(localStorage.getItem(AUTH_DATA));
  const [showAlert, setShowAlert] = useState(false);

  const { switcher, themes } = useThemeSwitcher();

  const toggleTheme = () => {
    const changedTheme = currentTheme == "light" ? "dark" : "light";
    onSwitchTheme(changedTheme);
    localStorage.setItem("theme", changedTheme);
    switcher({ theme: themes[changedTheme] });
  };

  const openLogout = () => {
    setShowAlert(true);
  };

  const keepLogin = () => {
    setShowAlert(false);
  };
  const logout = () => {
    signOut();
    setShowAlert(false);
  };

  const menuItem = [
    {
      title: "Profile",
      icon: UserOutlined,
      path: "/app/pages/profile",
    },

    {
      title: "Setting",
      icon: SettingOutlined,
      path: "/app/pages/setting",
    },
    {
      title: currentTheme == "light" ? "Dark Mode" : "Light Mode",
      icon:
        currentTheme == "light" ? DarkModeOutlinedIcon : LightModeOutlinedIcon,
      onClick: toggleTheme,
    },
  ];

  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar
            size={45}
            src={
              authData?.picture
                ? Utils.avatar50(authData.picture)
                : Utils.avatar50Default(authData.gender)
            }
          />
          <div className="pl-3">
            <h4 className="mb-0">{authData?.fullName}</h4>
            <span className="text-muted">{authData?.role}</span>
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu>
          {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                {el.path ? (
                  <Link to={{ pathname: el.path }}>
                    <Icon type={el.icon} />
                    <span className="font-weight-normal">{el.title}</span>
                  </Link>
                ) : (
                  <div
                    className="cursor-pointer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onClick={el.onClick}
                  >
                    <Icon className="" type={el.icon} />
                    <span className="font-weight-normal">{el.title}</span>
                  </div>
                )}
              </Menu.Item>
            );
          })}
          <Menu.Item key={menuItem.length + 1} onClick={openLogout}>
            <span>
              <LogoutOutlined />
              <span className="font-weight-normal">Sign Out</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <>
      <Dropdown
        placement="bottomRight"
        overlay={profileMenu}
        trigger={["click"]}
      >
        <Menu className="d-flex align-item-center" mode="horizontal">
          <Menu.Item key="profile">
            {authData && (
              <Avatar
                src={
                  authData?.picture
                    ? Utils.avatar50(authData.picture)
                    : Utils.avatar50Default(authData.gender)
                }
              />
            )}
          </Menu.Item>
        </Menu>
      </Dropdown>
      <Alert
        open={showAlert}
        animation="scale"
        data={{
          title: "Are You Sure! Want to Logout?",
          icon: "logout",
          buttons: [
            {
              type: "default",
              text: "No",
              callback: keepLogin,
            },
            {
              class: "red",
              type: "error",
              text: "Yes",
              callback: logout,
            },
          ],
        }}
      />
    </>
  );
};

const mapStateToProps = ({ theme }) => {
  const {
    navType,
    sideNavTheme,
    navCollapsed,
    topNavColor,
    headerNavColor,
    locale,
    currentTheme,
    direction,
  } = theme;
  return {
    navType,
    sideNavTheme,
    navCollapsed,
    topNavColor,
    headerNavColor,
    locale,
    currentTheme,
    direction,
  };
};

const mapDispatchToProps = {
  onSwitchTheme,
  signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavProfile);
