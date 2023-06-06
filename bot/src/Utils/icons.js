import React from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import SendIcon from "@mui/icons-material/Send";

const icons = {
  close: <CloseOutlinedIcon />,
  unmute: <VolumeUpOutlinedIcon />,
  mute: <VolumeOffOutlinedIcon />,
  agent: <SupportAgentOutlinedIcon />,
  send: <SendIcon />,
};

export default icons;
