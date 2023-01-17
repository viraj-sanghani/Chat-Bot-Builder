import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "antd";
import { Link } from "react-router-dom";

const renderAvatar = (props) => {
  return (
    <Avatar {...props} className={`ant-avatar-${props.type}`}>
      {props.text}
    </Avatar>
  );
};

export const AvatarStatus = (props) => {
  const {
    name,
    suffix,
    subTitle,
    id,
    type,
    src,
    icon,
    size,
    shape,
    gap,
    text,
    onNameClick,
  } = props;
  return (
    <div className="avatar-status d-flex align-items-center">
      <Link to={{ pathname: "agent/p/" + id }}>
        {renderAvatar({ icon, src, type, size, shape, gap, text })}
      </Link>
      <div className="ml-3">
        <Link to={{ pathname: "agent/p/" + id }}>
          <div className="avatar-status-name clickable">{name}</div>
          <span>{suffix}</span>
        </Link>
        <div className="text-muted avatar-status-subtitle">{subTitle}</div>
      </div>
    </div>
  );
};

AvatarStatus.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.string,
  onNameClick: PropTypes.func,
};

export default AvatarStatus;
