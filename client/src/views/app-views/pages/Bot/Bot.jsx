import "./Bot.css";
import React, { Component, useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Tooltip,
  message,
  Button,
  Avatar,
  Skeleton,
} from "antd";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { call, getBots } from "redux/axios";
import { Link, Redirect } from "react-router-dom";
import Alert from "components/shared-components/Alert/Alert";
import { success, error } from "components/shared-components/Toast/Toast";
import Utils from "utils";
import { script } from "configs/BotScriptConfig";
import moment from "moment";
const { Meta } = Card;

function Bot() {
  const [loading, setLoading] = useState(true);
  const [deleteBotId, setDeleteBotId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [bots, setBots] = useState([]);

  const fetchBots = async () => {
    try {
      const res = await call(getBots());
      setBots(res.data);
      setLoading(false);
    } catch (err) {
      error(err);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const keepIt = () => {
    setDeleteBotId("");
    setShowAlert(false);
  };

  const deleteIt = () => {
    setBots(bots.filter((item) => item.botId !== deleteBotId));
    setDeleteBotId("");
    setShowAlert(false);
    success("Bot deleted successfully");
  };

  const copyCode = (apiKey) => {
    const s = script.replaceAll("API_KEY", apiKey);
    navigator.clipboard.writeText(s);
    success("Code Copied 🎉");
  };

  return (
    <>
      <div className="d-table ml-auto mb-3">
        <Link to={{ pathname: "./bot/add" }}>
          <Button type="primary">Add Bot</Button>
        </Link>
      </div>

      <div className="bots-wrap">
        {bots.map((ele, i) => {
          return (
            <Card
              style={{
                width: 300,
                marginTop: 16,
                padding: 0,
                borderRadius: "0.625rem",
                overflow: "hidden",
              }}
              key={i}
              actions={[
                <Tooltip placement="top" title="Copy Code">
                  <ContentCopyOutlinedIcon
                    key="copy"
                    onClick={() => copyCode(ele.apiKey)}
                  />
                </Tooltip>,
                <Tooltip placement="top" title="Questions Tree">
                  <Link to={"./bot/editor/" + ele.botId}>
                    <AccountTreeOutlinedIcon key="QuestionsTree" />
                  </Link>
                </Tooltip>,
                <Tooltip placement="top" title="Edit Bot">
                  <Link to={"./bot/edit/" + ele.botId}>
                    <BorderColorOutlinedIcon key="edit" />
                  </Link>
                </Tooltip>,
                <Tooltip placement="top" title="Delete Bot">
                  <DeleteOutlinedIcon
                    key="delete"
                    onClick={() => {
                      setDeleteBotId(ele.botId);
                      setShowAlert(true);
                    }}
                  />
                </Tooltip>,
              ]}
            >
              <div
                style={{
                  background: ele.background,
                  padding: 20,
                }}
              >
                <Skeleton loading={loading} avatar active>
                  <Meta
                    avatar={<Avatar size={50} src={Utils.botIcon(ele.icon)} />}
                    title={ele.botName}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    // description="This is the description"
                  />
                  <div style={{ marginTop: "15px", color: "#FFF" }}>
                    Last Used :{" "}
                    {ele?.lastUsed
                      ? moment(ele.lastUsed).format("lll")
                      : "Not Used"}
                  </div>
                </Skeleton>
              </div>
            </Card>
          );
        })}
      </div>

      <Alert
        open={showAlert}
        animation="scale"
        data={{
          title: "Are You Sure! Want to Delete This Bot?",
          icon: "warning",
          extraInfo:
            "Do you really want to delete these Bot? You can't view this in your list anymore if you delete!",
          buttons: [
            {
              type: "success",
              text: "No, Keep It",
              callback: keepIt,
            },
            {
              class: "red",
              type: "error",
              text: "Yes, Delete It",
              callback: deleteIt,
            },
          ],
        }}
      />
    </>
  );
}

export default Bot;
