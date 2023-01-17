import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { call, getBots } from "redux/axios";
const { Option } = Select;

function ChatBotSelection({ match, location }) {
  const history = useHistory();
  const [bots, setBots] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await call(getBots());
        setBots(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const botChange = (id) => {
    history.push(`${match.url}/${id}`);
  };

  return (
    <div className="user-selection-container" style={{ minHeight: 500 }}>
      <div className="user-selection-title">
        Choose an chatbot to view chats
      </div>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Select a chatbot"
        optionFilterProp="children"
        onChange={botChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {bots.map((bot) => (
          <Option key={bot.botId} value={bot.botId}>
            {bot.botName}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default ChatBotSelection;
