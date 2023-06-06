import { Button, TextField } from "@mui/material";
import moment from "moment";
import React from "react";

function Form({ align, icon, item }) {
  return (
    <div className={align === "r" ? "chat-right" : "chat-left"}>
      <div className="chat-icon">
        <img src={icon} alt="" />
      </div>
      <div className="chat-mes bg">
        <div className="form-wrapper">
          <h3 className="form-title">{item.mes}</h3>
          {item.fields.map((field, i) => (
            <TextField
              key={i}
              className="form-input"
              label={field.title}
              variant="outlined"
              size="small"
            />
          ))}
          <Button variant="contained">{item.btnText}</Button>
        </div>
        <div className="chat-time">
          {moment(item?.createdAt, "YYYY-MM-DD h:mm:ss").format("h:mm a")}
        </div>
      </div>
    </div>
  );
}

export default Form;
