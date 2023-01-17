const jwt = require("jsonwebtoken");
const messages = require("../helpers/appConstants");
const agents = require("../models/agents");
const { verifyJwt } = require("../helpers/utils");

const userAuth = async function (req, res, next) {
  const bearer = req.headers["authorization"];
  if (!bearer)
    return res
      .status(401)
      .json({ success: false, message: messages.authRequire });
  const checkBearer = bearer.startsWith("Bearer");
  if (!checkBearer)
    return res
      .status(401)
      .json({ success: false, message: messages.wrongAuth });
  let token = bearer.replace("Bearer", "");
  const verifyToken = verifyJwt(token.trim());
  if (!verifyToken)
    return res.status(401).json({ success: false, message: messages.wrongJwt });
  const data = await agents.findOne({ agentId: verifyToken.id });
  if (!data)
    return res.status(401).json({ success: false, message: messages.userNot });
  if (data.isBlock == true)
    return res
      .status(401)
      .json({ success: false, message: messages.userBlock });
  req.token = data;
  if (data) {
    req.agentId = verifyToken.id;
    req.clientId = verifyToken.clientId;
    next();
  } else {
    res.status(401).json({ success: false, message: messages.userNot });
  }
};
module.exports = { userAuth };
