import React, { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers-pro";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import icons from "../../Utils/icons";
import GalleryModel from "./GalleryModel";
import MesCon from "./MesCon";
import { setInfoData } from "../../redux/reducers/botReducer";
import { initChat, newMes, newRes } from "../../redux/actions/bot";
import moment from "moment";
import { validate } from "../../Utils/validate";
import { error } from "./../Toast/Toast";

function ChatCon() {
  const dispatch = useDispatch();
  const chatMesRef = useRef(null);
  const [infoFormData, setInfoFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [datePicker, setDatePicker] = useState(moment());
  const [timePicker, setTimePicker] = useState(moment());
  const {
    menu,
    botDetails,
    liveChatEnabled,
    isOpen,
    isInitChat,
    curMenu,
    localData,
    infoData,
  } = useSelector((state) => state.bot);

  useEffect(() => {
    if (isOpen && !isInitChat && (!botDetails.infoForm || infoData?.name)) {
      dispatch(
        initChat(menu, localData.curMenu, botDetails.botId, botDetails.userId)
      );
    }
  }, [isOpen, infoData]);

  const setData = (val, key) => {
    setInfoFormData({ ...infoFormData, [key]: val });
  };

  const handleInfoSubmit = () => {
    let err;
    for (const key in infoFormData) {
      err = validate(infoFormData[key], key);
      if (err) break;
    }
    if (!err) {
      dispatch(setInfoData(infoFormData));
    } else error(err);
  };

  const setValue = (val, t) => {
    if (t == "date") {
      setDatePicker(val);
      setDatePickerOpen(false);
      chatMesRef.current.value = moment(val).format("YYYY-DD-MM");
    } else {
      setTimePicker(val);
      chatMesRef.current.value = moment(val).format("hh:mm a");
    }
  };

  const sendMes = () => {
    const val = chatMesRef.current.value;
    if (val) {
      const err =
        curMenu?.valid && curMenu?.valid !== "any"
          ? validate(val, curMenu?.valid)
          : false;
      if (!err) {
        datePickerOpen && setDatePickerOpen(false);
        timePickerOpen && setTimePickerOpen(false);
        chatMesRef.current.value = "";
        /* chatMesRef.current.disabled = true;
        chatMesRef.current.focus(); */
        !liveChatEnabled
          ? dispatch(newRes(val, curMenu.save, false, menu, curMenu?.next))
          : dispatch(newMes(val));
      } else {
        error(err);
      }
    }
  };

  return (
    <div className="chat-body">
      <ToastContainer className="toast-container" pauseOnFocusLoss={false} />

      {botDetails.infoForm && !infoData?.name ? (
        <div className="chat-intro-sec">
          <div className="intro-header">
            <div className="itr-hdr-logo">
              <img src={botDetails.icon} alt="" />
            </div>
            <p className="itr-txt">
              Please fill out the form below to start chatting.
            </p>
          </div>
          <div className="intro-form">
            <TextField
              className="intro-input"
              label="Name"
              variant="outlined"
              size="small"
              onChange={(e) => setData(e.target.value, "name")}
            />
            <TextField
              className="intro-input"
              label="Email Id"
              variant="outlined"
              size="small"
              onChange={(e) => setData(e.target.value, "email")}
            />
            <TextField
              className="intro-input"
              label="Mobile No"
              variant="outlined"
              size="small"
              onChange={(e) => setData(e.target.value, "mobile")}
            />
            <Button variant="contained" onClick={handleInfoSubmit}>
              {icons.send} Start Chat
            </Button>
          </div>
        </div>
      ) : (
        <>
          <MesCon />

          <div className="chat-mes-box">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                className="date-picker"
                label="Date"
                open={datePickerOpen}
                value={datePicker}
                inputFormat="YYYY-DD-MM"
                onChange={(e) => setValue(e, "date")}
                shouldDisableDate={(e) => e.day() === 0}
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                className="time-picker"
                label="Time"
                open={timePickerOpen}
                value={timePicker}
                onChange={(e) => setValue(e, "time")}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <input
              type="text"
              className="chat-text-box"
              id="messageChatInput"
              placeholder="Type your message here"
              autoComplete="off"
              ref={chatMesRef}
              onKeyDown={(e) => {
                e.keyCode === 13 && sendMes(e.target.value);
              }}
              onClick={() => {
                if (isOpen && curMenu?.type === "question") {
                  if (curMenu?.valid === "date") setDatePickerOpen(true);
                  else if (curMenu?.valid === "time") setTimePickerOpen(true);
                }
              }}
              disabled={
                liveChatEnabled || curMenu?.type === "question" ? false : true
              }
            />
            <Button
              className="send-btn"
              variant="contained"
              onClick={sendMes}
              disabled={
                liveChatEnabled || curMenu?.type === "question" ? false : true
              }
            >
              {icons.send}
            </Button>
          </div>
        </>
      )}

      <GalleryModel />
    </div>
  );
}

export default ChatCon;
