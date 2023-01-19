const messages = require("../helpers/appConstants");
const fs = require("fs");
const { resizeImg } = require("../helpers/utils");
const { find, findOne, update, deleteOne } = require("../config/db");
const PICTURE_ORG_DEST = "./img/avatar/";
const PICTURE_50_DEST = "./img/avatar-50/";
let PATH = __dirname.split("\\");
PATH.pop();
PATH = PATH.join("/");

exports.agent = async (req, res) => {
  const { agentId } = req.params;

  const data = await findOne(
    "agents",
    {
      agentId,
    },
    "fullName firstName lastName email mobile isBlock picture agentId gender"
  );

  res.status(200).json({ success: true, data });
};

exports.agents = async (req, res) => {
  const { clientId } = req;

  const data = await find(
    "agents",
    {
      clientId,
      role: "User",
    },
    "fullName email mobile isBlock picture agentId gender"
  );
  res.status(200).json({ success: true, data });
};

exports.agentsList = async function (req, res) {
  const { clientId } = req;
  const data = await find(
    "agents",
    {
      clientId,
      role: "User",
    },
    "agentId fullName"
  );

  res.status(200).json({ success: true, data });
};

exports.profileImg = (req, res) => {
  const img = `${PICTURE_ORG_DEST}${req.params.name}`;
  if (fs.existsSync(img)) {
    res.sendFile(img, { root: "." });
  } else {
    res.sendFile(`${PICTURE_ORG_DEST}default.jpg`, { root: "." });
  }
};

exports.profileImg50 = (req, res) => {
  const img = `${PICTURE_50_DEST}${req.params.name}`;
  if (fs.existsSync(img)) {
    res.sendFile(img, { root: "." });
  } else {
    res.sendFile(`${PICTURE_50_DEST}default.jpg`, { root: "." });
  }
};

exports.agentEdit = async (req, res) => {
  const agentId = req.body?.id;
  delete req.body?.id;
  if (req.file && req.file.path) {
    req.body["picture"] = req.file.filename;
    resizeImg(
      `${PATH}/img/avatar/`,
      `${PATH}/img/avatar-50/`,
      req.file.filename,
      [50, 50],
      60
    );
  }
  if (req.body?.firstName && req.body?.lastName) {
    req.body["fullName"] = `${req.body.firstName} ${req.body.lastName}`;
  }
  await update("agents", { agentId }, req.body);
  let userDetails = await findOne(
    "agents",
    { agentId },
    "agentId firstName lastName fullName picture clientId role gender"
  );

  res.status(200).json({
    success: true,
    message: messages.userUpdate,
    data: {
      id: userDetails.agentId,
      clientId: userDetails.clientId,
      role: userDetails.role,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      fullName: userDetails.fullName,
      picture: userDetails.picture,
      gender: userDetails.gender,
    },
  });
};

exports.userDelete = async (req, res) => {
  const { agentId } = req.params;
  await deleteOne("agents", { agentId });
  res.status(200).json({ success: true });
};
