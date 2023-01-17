const clients = require("../models/clients");
const agents = require("../models/agents");
const messages = require("../helpers/appConstants");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../helpers/mailer");
const {
  compare,
  hash,
  verifyJwt,
  generateToken,
  resizeImg,
} = require("../helpers/utils");
const fs = require("fs");
let PATH = __dirname.split("\\");
PATH.pop();
PATH = PATH.join("/");

const register = async function (req, res) {
  const email = await agents.findOne({ email: req.body.email });
  if (email)
    return res
      .status(400)
      .json({ success: false, message: messages.emailExists });

  const phone = await agents.findOne({ mobile: req.body.mobile });
  if (phone)
    return res
      .status(400)
      .json({ success: false, message: messages.phoneExists });
  let hashVal = await hash(req.body.password, parseInt(process.env.JWT_SALT));
  req.body.password = hashVal;
  req.body["fullName"] = `${req.body.firstName} ${req.body.lastName}`;
  req.body["apiKey"] = (Math.random() + 1).toString(36).substring(2);
  const addClient = new clients(req.body);
  addClient.save().then(async (result) => {
    const addAgent = new agents(req.body);
    addAgent.clientId = result.clientId;
    addAgent.role = "Admin";
    addAgent.picture = "default-avatar.png";
    let agentRes;
    try {
      agentRes = await addAgent.save();
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: messages.serverError });
    }
    let subject = "Verify email address";
    let text = "Verify email address";
    let tokenDetails = await generateToken({ userId: agentRes._id });
    fs.readFile("html/verifyemail.html", "utf-8", async function (err, data) {
      let html = data.replace("tokenDetails", `${tokenDetails}`);
      html = html.replace("SERVER_URL", process.env.SERVER_URL);
      html = html.replace(/Users/g, req.body.fullName);
      sendMail({ to: req.body.email, subject, text, html });
      return res
        .status(200)
        .json({ success: true, message: messages.userRegister });
    });
  });
};
const addAgent = async function (req, res) {
  const email = await agents.findOne({ email: req.body.email });
  if (email)
    return res
      .status(400)
      .json({ success: false, message: messages.emailExists });

  const phone = await agents.findOne({ mobile: req.body.mobile });
  if (phone)
    return res
      .status(400)
      .json({ success: false, message: messages.phoneExists });
  let hashVal = await hash(req.body.password, parseInt(process.env.JWT_SALT));
  req.body.password = hashVal;
  req.body["fullName"] = `${req.body.firstName} ${req.body.lastName}`;

  const addAgent = new agents(req.body);
  const { clientId } = req;
  addAgent.clientId = clientId;
  addAgent.role = "User";
  addAgent.picture = "";
  let agentRes;
  try {
    agentRes = await addAgent.save();
  } catch (errr) {
    return res
      .status(400)
      .json({ success: false, message: messages.serverError });
  }
  let subject = "Verify email address";
  let text = "Verify email address";
  let tokenDetails = await generateToken({ userId: agentRes._id });
  fs.readFile("html/verifyemail.html", "utf-8", async function (err, data) {
    let html = data.replace("tokenDetails", `${tokenDetails}`);
    html = html.replace("SERVER_URL", process.env.SERVER_URL);
    html = html.replace(/Users/g, req.body.fullName);
    sendMail({ to: req.body.email, subject, text, html });
    return res
      .status(200)
      .json({ success: true, message: messages.userRegister });
  });
};
const login = async function (req, res) {
  let Agent = await agents.findOne({ email: req.body.email });
  if (Agent) {
    if (Agent.isBlock)
      return res
        .status(401)
        .json({ success: false, message: messages.userBlock });
    if (Agent.isEmailverified == false)
      return res
        .status(400)
        .json({ success: false, message: messages.emailNotverify });

    let checkPassword = await compare(req.body.password, Agent.password);
    if (checkPassword) {
      let token = jwt.sign(
        {
          id: Agent.agentId,
          clientId: Agent.clientId,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      let client = await clients
        .findOne({ clientId: Agent.clientId })
        .select("apiKey");
      return res.status(200).json({
        success: true,
        message: messages.login,
        token,
        data: {
          id: Agent.agentId,
          clientId: Agent.clientId,
          apiKey: client.apiKey,
          role: Agent.role,
          firstName: Agent.firstName,
          lastName: Agent.lastName,
          fullName: Agent.fullName,
          picture: Agent.picture,
          gender: Agent.gender,
        },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: messages.wrongPassword });
    }
  } else {
    res.status(401).json({ success: false, message: messages.wrongEmail });
  }
};
const forgotPassword = async function (req, res) {
  let Agent = await agents.findOne({ email: req.body.email });
  if (!Agent)
    return res
      .status(400)
      .json({ success: false, message: messages.emailNotregister });
  let random = Math.floor(Math.random() * 1e16);
  let token = jwt.sign(
    {
      id: Agent._id,
      time: Date.now(),
      forgotToken: random,
    },
    process.env.JWT_SECRET
  );
  let subject = "Reset Password Link";
  let text = token;
  fs.readFile("html/forgotmail.html", "utf-8", function (err, data) {
    let html = data.replace(/token/g, token);
    html = html.replace(/URL/g, process.env.WEB_URL);
    html = html.replace(/Admin/g, Agent.fullName);
    sendMail({ to: req.body.email, subject, text, html });
    agents
      .findOneAndUpdate(
        { email: req.body.email },
        {
          forgotToken: random,
        }
      )
      .then(
        res.status(200).json({ success: true, message: messages.forgotLink })
      );
  });
};
const resetPassword = async function (req, res) {
  let newPassword = req.body.password;
  let token = verifyJwt(req.body.token);
  let Agent = await agents.findOne({ _id: token.id });
  let checkPassword = await compare(newPassword, Agent.password);
  if (checkPassword)
    return res.status(400).json({ success: false, message: messages.passErr });
  if (!Agent)
    return res
      .status(400)
      .json({ success: false, message: messages.wrongEmail });
  let time = token.time;
  let timeDiff = (new Date() - time) / 60000;
  if (timeDiff > 10)
    return res
      .status(400)
      .json({ success: false, message: messages.linkexpire });
  let forgotToken = token.forgotToken;
  if (Agent.forgotToken != forgotToken)
    return res
      .status(400)
      .json({ success: false, message: messages.linkexpire });
  hash(newPassword, parseInt(process.env.JWT_SALT)).then(function (hash) {
    agents
      .findOneAndUpdate(
        { _id: token.id },
        {
          password: hash,
          forgotToken: "",
        }
      )
      .then(
        res.status(200).json({ success: true, message: messages.passChange })
      );
  });
};
const changePassword = async function (req, res) {
  const { agentId } = req;

  if (req.body.oldPass == req.body.newPass)
    return res.status(400).json({ success: false, message: messages.passErr });

  const agent = await agents.findOne({ agentId }).select("password");

  const check = await compare(req.body.oldPass, agent.password);
  if (!check)
    return res
      .status(400)
      .json({ success: false, message: messages.passMatch });

  const hashVal = await hash(req.body.newPass, parseInt(process.env.JWT_SALT));
  await agents.findOneAndUpdate({ agentId }, { password: hashVal });
  return res.status(200).json({ success: true, message: messages.passChange });
};
const profileInfo = async function (req, res) {
  const userDetails = req.token;
  let profile = await agents
    .findOne({ _id: userDetails._id })
    .select("firstName lastName email mobile isBlock picture agentId gender");
  res
    .status(200)
    .json({ success: true, data: profile, message: messages.profileFetch });
};
const editProfile = async function (req, res) {
  const { agentId } = req;
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
    let client = await clients
      .findOne({ clientId: userDetails.clientId })
      .select("apiKey");
    res.status(200).json({
      success: true,
      message: messages.userUpdate,
      data: {
        id: userDetails.agentId,
        clientId: userDetails.clientId,
        apiKey: client.apiKey,
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
const verifyEmail = async function (req, res) {
  let tokenDetails = await verifyJwt(req.query.token);
  if (tokenDetails) {
    let userDetails = await agents.findOne({ _id: tokenDetails.userId });
    if (userDetails) {
      if (userDetails.isEmailverified == false) {
        await agents.updateOne(
          { _id: userDetails._id },
          { isEmailverified: true }
        );
        fs.readFile("html/emailVerified.html", "utf-8", function (err, data) {
          res.status(200).send(data);
        });
      } else {
        fs.readFile("html/linkExpired.html", "utf-8", function (err, data) {
          res.status(200).send(data);
        });
      }
    } else {
      fs.readFile("html/linkExpired.html", "utf-8", function (err, data) {
        res.status(200).send(data);
      });
    }
  } else {
    fs.readFile("html/linkExpired.html", "utf-8", function (err, data) {
      res.status(200).send(data);
    });
  }
};
const forgotLinkvalid = async function (req, res) {
  let token = verifyJwt(req.body.token);
  if (token) {
    let id = token.id;
    let Agent = await agents.findOne({ _id: id });
    if (Agent) {
      let time = token.time;
      let timeDiff = (new Date() - time) / 60000;
      if (timeDiff > 10)
        return res.status(400).json({
          success: false,
          message: messages.linkexpire,
          data: { reset: false },
        });
      let forgotToken = token.forgotToken;
      if (Agent.forgotToken != forgotToken)
        return res.status(400).json({
          success: false,
          message: messages.linkexpire,
          data: { reset: false },
        });
      res.status(200).json({
        success: true,
        message: messages.linkValid,
        data: { reset: true },
      });
    } else
      return res.status(400).json({
        success: false,
        message: messages.linkexpire,
        data: { reset: false },
      });
  } else
    return res.status(400).json({
      success: false,
      message: messages.linkexpire,
      data: { reset: false },
    });
};
const verifyToken = (req, res) => {
  res.status(200).json({
    success: true,
  });
};

module.exports = {
  register,
  addAgent,
  login,
  forgotPassword,
  forgotLinkvalid,
  resetPassword,
  changePassword,
  profileInfo,
  editProfile,
  verifyEmail,
  verifyToken,
};
