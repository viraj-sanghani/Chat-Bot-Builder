import React from "react";
import "./Alert.css";
import {
  CheckOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  WarningOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

function Alert({ open, animation, data }) {
  return (
    open && (
      <div className="alert-layer">
        <AlertBox animation={animation}>
          <div className="alert-content">
            <div className="alert-icon">
              <Icon type={data.icon} />
            </div>
            <h3 className="alert-title">{data?.title}</h3>
            <p className="alert-extra-info">{data?.extraInfo}</p>
          </div>
          <div className="alert-btns-wrap">
            {data.buttons.map((btn, i) => {
              return <Btn data={btn} key={i} />;
            })}
          </div>
        </AlertBox>
      </div>
    )
  );
}

const AlertBox = ({ animation, children }) => {
  const animations = [
    {
      name: "scale",
      value: "scale",
    },
    {
      name: "slide-top",
      value: "slideTop",
    },
    {
      name: "slide-bottom",
      value: "slideBottom",
    },
  ];
  const ani = animations.filter((ani) => ani.name === animation);
  return <div className={"alert-box" + " ani-" + ani[0].value}>{children}</div>;
};

const Icon = ({ type }) => {
  switch (type) {
    case "success":
      return <CheckOutlined className="c-success" />;
    case "error":
      return <CloseCircleOutlined className="c-error" />;
    case "delete":
      return <DeleteOutlined className="c-error" />;
    case "warning":
      return <WarningOutlined className="c-warning" />;
    case "logout":
      return <LogoutOutlined className="c-error" />;
  }
};

const Btn = ({ data }) => {
  data.class = data.class ? " " + data.class : "";
  switch (data.type) {
    case "success":
      return (
        <button
          className={"alert-btn b-success" + data.class}
          onClick={data.callback}
        >
          {data.text}
        </button>
      );
    case "error":
      return (
        <button
          className={"alert-btn b-error" + data.class}
          onClick={data.callback}
        >
          {data.text}
        </button>
      );
    case "warning":
      return (
        <button
          className={"alert-btn b-warning" + data.class}
          onClick={data.callback}
        >
          {data.text}
        </button>
      );
    default:
      return (
        <button
          className={"alert-btn b-default" + data.class}
          onClick={data.callback}
        >
          {data.text}
        </button>
      );
  }
};

export default Alert;

{
  /* <Alert
  open={showAlert}
  animation="scale"
  data={{
    title: "Are You Sure! Want to Delete This Record?",
    icon: "success",
    extraInfo:
      "Do you really want to delete these records? You can't view this in your list anymore if you delete!",
    buttons: [
      {
        type: "success",
        text: "No, Keep It",
        callback: keep,
      },
      {
        class: "red",
        type: "error",
        text: "Yes, Delete It",
        callback: delete1,
      },
    ],
  }}
/> */
}
