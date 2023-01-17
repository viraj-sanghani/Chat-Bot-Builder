import React from "react";
import LoginForm from "../../components/LoginForm";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const backgroundURL = "/img/others/img-17.jpg";
const backgroundStyle = {
  backgroundImage: `url(${backgroundURL})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const LoginTwo = (props) => {
  const theme = useSelector((state) => state.theme.currentTheme);

  return (
    <div className={`h-100 ${theme === "light" ? "bg-white" : ""}`}>
      <Row justify="center" className="align-items-stretch h-100">
        <Col xs={20} sm={20} md={24} lg={16}>
          <div className="container d-flex flex-column justify-content-center h-100">
            <Row justify="center">
              <Col xs={24} sm={24} md={20} lg={12} xl={8}>
                <h1>Sign In</h1>
                <p>
                  Don't have an account yet?{" "}
                  <Link to="./register">Sign Up</Link>
                </p>
                <div className="mt-4">
                  <LoginForm {...props} />
                </div>
                <Link
                  to="./forgotPassword"
                  className="m-auto d-block"
                  style={{ width: "fit-content" }}
                >
                  Forgot Password?
                </Link>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={8}>
          <div
            className="d-flex flex-column justify-content-between h-100 px-4"
            style={backgroundStyle}
          >
            <div className="text-right">
              <img src="/img/logo.png" alt="logo" width={150} />
            </div>
            <Row justify="center">
              <Col xs={0} sm={0} md={0} lg={20}>
                <img
                  className="img-fluid mb-5"
                  src="/img/others/img-18.png"
                  alt=""
                />
                <h1 className="text-white">Welcome to QuickConnect</h1>
                {/* <p className="text-white">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus ullamcorper nisl erat, vel convallis elit fermentum
                  pellentesque.
                </p> */}
              </Col>
            </Row>
            <div className="d-flex justify-content-end pb-4">
              <div>
                <a
                  className="text-white"
                  href="/#"
                  onClick={(e) => e.preventDefault()}
                >
                  Term & Conditions
                </a>
                <span className="mx-2 text-white"> | </span>
                <a
                  className="text-white"
                  href="/#"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy & Policy
                </a>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginTwo;
