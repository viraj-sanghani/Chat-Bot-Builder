const agents = require("../models/agents");
const messages = require("../helpers/appConstants");
const fs = require("fs");
const { resizeImg } = require("../helpers/utils");
const PICTURE_ORG_DEST = "./img/avatar/";
const PICTURE_50_DEST = "./img/avatar-50/";
let PATH = __dirname.split("\\");
PATH.pop();
PATH = PATH.join("/");

exports.agent = async (req, res) => {
  const { agentId } = req.params;

  const data = await agents
    .findOne({
      agentId,
    })
    .select(
      "fullName firstName lastName email mobile isBlock picture agentId gender"
    );
  res.status(200).json({ success: true, data });
};

exports.agents = async (req, res) => {
  const { clientId } = req;

  const data = await agents
    .find({
      clientId,
      role: { $not: { $eq: "Admin" } },
    })
    .select("fullName email mobile isBlock picture agentId gender");
  res.status(200).json({ success: true, data });
};

exports.agentsList = async function (req, res) {
  const { clientId } = req;
  const data = await agents
    .find({
      clientId,
      role: { $not: { $eq: "Admin" } },
    })
    .select("agentId fullName");
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

exports.agentEdit = (req, res) => {
  const agentId = req.body?.id;
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
  agents.findOneAndUpdate({ agentId }, req.body).then(async () => {
    let userDetails = await agents
      .findOne({ agentId })
      .select(
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
  });
};

exports.userDelete = async (req, res) => {
  const { agentId } = req.params;
  await agents.deleteOne({ agentId });
  res.status(200).json({ success: true });
};
