import React from "react";

function DateTitle({ mes }) {
  return (
    <div className="chat-date">
      <div className="chat-date-title">
        {mes.split("-").reverse().join("-")}
      </div>
    </div>
  );
}

export default DateTitle;
