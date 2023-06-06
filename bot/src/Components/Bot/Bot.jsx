import "./style.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatCon from "./ChatCon";
import { fetchData, setPopup } from "../../redux/actions/bot";
import { sendMessage, setLocalData } from "../../redux/reducers/botReducer";

function Bot() {
  let { key } = useParams();
  const dispatch = useDispatch();
  const { botDetails, isOpen, localData } = useSelector((state) => state.bot);
  const message = "Click here to view";

  const handleMessage = (e) => {
    if (e.data.flag === "returnData") {
      dispatch(setLocalData(e.data.items));
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    dispatch(
      sendMessage({
        flag: "getData",
        keys: ["userId", "botId", "apiKey", "resId", "curMenu"],
      })
    );
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    key && localData && dispatch(fetchData(key, localData));
  }, [key, localData?.userId]);

  return botDetails?.botId ? (
    <>
      <div
        className={`chat-popup ${
          botDetails.align === "Right" ? "align-right" : "align-left"
        } ${!isOpen ? "d-none" : ""}`}
      >
        <Header />
        <ChatCon />
        <Footer />
      </div>

      <div
        className={`chat-popup-btn-wrap ${
          botDetails.align === "Right" ? "align-right" : "align-left"
        } ${isOpen ? "d-none" : ""}`}
      >
        <div
          className="chat-popup-btn"
          onClick={() => dispatch(setPopup(true))}
        >
          <img className="close-popup-icon" src={botDetails.icon} alt="" />
        </div>
        <h3 className="wel-mes">
          {message.split("").map((ele, i) => (
            <span key={i}>{ele}</span>
          ))}
        </h3>
      </div>
    </>
  ) : (
    ""
  );
}

export default Bot;
