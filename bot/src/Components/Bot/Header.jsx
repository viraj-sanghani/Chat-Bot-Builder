import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPopup } from "../../redux/actions/bot";
import { setBotMute } from "../../redux/reducers/botReducer";
import icons from "../../Utils/icons";

function Header() {
  const dispatch = useDispatch();
  const { botDetails, isMute, liveChatEnabled, agent } = useSelector(
    (state) => state.bot
  );

  return (
    <div className="chat-header">
      <div className="img-wrap">
        <img src={botDetails.icon} alt="" />
      </div>
      <h2>
        {botDetails.botName}
        {liveChatEnabled && (
          <div className="agent-name">
            {icons.agent} <span> {agent.fullName}</span>
          </div>
        )}
      </h2>
      <div
        className="bot-sound-btn"
        onClick={() => dispatch(setBotMute(!isMute))}
      >
        {isMute ? icons.mute : icons.unmute}
      </div>
      <div className="bot-close-btn" onClick={() => dispatch(setPopup(false))}>
        {icons.close}
      </div>
    </div>
  );
}

export default Header;
