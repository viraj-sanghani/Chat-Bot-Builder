import React, { useEffect, useState } from "react";
import { Menu, Dropdown, Badge, Avatar, List, Button } from "antd";
import {
  MailOutlined,
  BellOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_DATA } from "redux/constants/Auth";
import moment from "moment";
import { roomUpdate } from "redux/actions/LiveChat";
import { call, updateRoom } from "redux/axios";

const getIcon = (icon) => {
  switch (icon) {
    case "chat":
      return <WechatOutlined />;
    case "mail":
      return <MailOutlined />;
    case "alert":
      return <WarningOutlined />;
    case "check":
      return <CheckCircleOutlined />;
    default:
      return <MailOutlined />;
  }
};

const getNotificationBody = (list, dispatch, history) => {
  const authData = JSON.parse(localStorage.getItem(AUTH_DATA));
  const handleAccept = async (room) => {
    /* try {
      const res = await call(
        updateRoom({ roomId: room.roomId, agentId: authData.id })
      );
      dispatch(roomUpdate({ roomId: room.roomId, agentId: authData.id }));
      history.push({ pathname: `/app/apps/chat/${room.botId}/${room.userId}` });
    } catch (err) {
      console.log(err);
    } */
    dispatch(roomUpdate({ roomId: room.roomId, agentId: authData.id }));
    history.push({ pathname: `/app/apps/chat/${room.botId}/${room.userId}` });
  };

  return list.length > 0 ? (
    <List
      size="small"
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item) => (
        <Link
          to={{
            pathname: `/app/apps/chat/${item.botId}/${item.userId}`,
          }}
          style={{ width: "100%" }}
          onClick={(e) => item.agentId == 0 && e.preventDefault()}
        >
          <List.Item className="list-clickable w-100 position-relative">
            <Flex alignItems="center" className="w-100">
              <div className="pr-3">
                <Avatar className={`ant-avatar-info`} icon={getIcon("chat")} />
              </div>
              <div className="mr-3">
                <span className="font-weight-bold text-dark">
                  {item.userId}
                </span>
                <br />
                <span className="font-weight-bold text-lightgray">
                  {item.botName}
                </span>
                <br />
                {item.agentId === 0 && (
                  <Button
                    type="primary"
                    size="small"
                    className="mt-1"
                    onClick={() => handleAccept(item)}
                  >
                    Accept
                  </Button>
                )}
              </div>
            </Flex>
            <small style={{ position: "absolute", right: 8, bottom: 8 }}>
              {moment(item.createdAt).format("lll")}
            </small>
          </List.Item>
        </Link>
      )}
    />
  ) : (
    <div className="empty-notification">
      <img
        src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
        alt="empty"
      />
      <p className="mt-3">You have viewed all notifications</p>
    </div>
  );
};

export const NavNotification = () => {
  const [visible, setVisible] = useState(false);
  const { rooms } = useSelector((state) => state.liveChat);
  const [notiCount, setNotiCount] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setNotiCount(
      rooms.length > 0 ? rooms.filter((e) => e.agentId === 0).length : 0
    );
  }, [rooms]);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const notificationList = (
    <div className="nav-dropdown nav-notification">
      <div className="nav-notification-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Notification</h4>
        {/* <Button
          className="text-primary"
          type="text"
          onClick={() => setData([])}
          size="small"
        >
          Clear{" "}
        </Button> */}
      </div>
      <div className="nav-notification-body">
        {getNotificationBody(rooms, dispatch, history)}
      </div>
      {/* {
        data.length > 0 ? 
        <div className="nav-notification-footer">
          <Link className="d-block" to={}>View all</Link>
        </div>
        :
        null
      } */}
    </div>
  );

  return (
    <Dropdown
      placement="bottomRight"
      overlay={notificationList}
      onVisibleChange={handleVisibleChange}
      visible={visible}
      trigger={["click"]}
    >
      <Menu mode="horizontal">
        <Menu.Item key="notification">
          <Badge count={notiCount || 0}>
            <BellOutlined className="nav-icon mx-auto" type="bell" />
          </Badge>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default NavNotification;
