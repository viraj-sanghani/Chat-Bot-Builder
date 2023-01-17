const express = require("express");
const router = express.Router();
const {
  register,
  addAgent,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  profileInfo,
  editProfile,
  verifyEmail,
  forgotLinkvalid,
  verifyToken,
  authBot,
} = require("../controllers/authController");
const { userAuth } = require("../middlewares/auth");
const { profile } = require("../middlewares/multer");
const { asyncTryCatch } = require("../middlewares/async");
const {
  validationRuleslogin,
  validationRulesChange,
  validationRulesReset,
  validationRulesforgot,
  validatonRulesregister,
} = require("../middlewares/validator");

router.post("/register", validatonRulesregister, asyncTryCatch(register));
router.post("/login", validationRuleslogin, asyncTryCatch(login));
router.post(
  "/forgotPassword",
  validationRulesforgot,
  asyncTryCatch(forgotPassword)
);
router.post("/forgotLinkvalid", asyncTryCatch(forgotLinkvalid));
router.post(
  "/resetPassword",
  validationRulesReset,
  asyncTryCatch(resetPassword)
);
router.post(
  "/changePassword",
  validationRulesChange,
  userAuth,
  asyncTryCatch(changePassword)
);
router.get("/verifyEmail", asyncTryCatch(verifyEmail));
router.get("/verifyToken", userAuth, asyncTryCatch(verifyToken));
router.put("/editProfile", userAuth, profile, asyncTryCatch(editProfile));
router.get("/profileInfo", userAuth, asyncTryCatch(profileInfo));
router.post(
  "/agent/add",
  userAuth,
  validatonRulesregister,
  asyncTryCatch(addAgent)
);

module.exports = router;
