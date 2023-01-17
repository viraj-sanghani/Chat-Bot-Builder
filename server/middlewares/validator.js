const { body } = require("express-validator");
const validatonRulesregister = [
  body("email")
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .exists()
    .withMessage("Please enter password")
    .isLength({ min: 6 })
    .withMessage("Password length must be minimun 6 digits in length"),
  body("mobile").notEmpty().withMessage("Please enter mobile number"),
  body("firstName").notEmpty().withMessage("Please enter firstName"),
  body("lastName").notEmpty().withMessage("Please enter lastName"),
];

const validationRuleslogin = [
  body("email").notEmpty().withMessage("Please enter email"),
  body("password").notEmpty().withMessage("Please enter Password"),
];
const validationRulesforgot = [
  body("email").notEmpty().withMessage("Please enter email"),
];
const validationRulesChange = [
  body("newPass")
    .notEmpty()
    .withMessage("Please enter newpassword")
    .isLength({ min: 6 })
    .withMessage("Password length must be minimun 6 digits in length"),
  body("oldPass")
    .notEmpty()
    .withMessage("Please enter oldpassword")
    .withMessage("Password length must be minimun 6 digits in length"),
];
const validationRulesReset = [
  body("password")
    .notEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 6 })
    .withMessage("Password length must be minimun 6 digits in length"),
];

module.exports = {
  validationRuleslogin,
  validationRulesforgot,
  validationRulesChange,
  validationRulesReset,
  validatonRulesregister,
};
