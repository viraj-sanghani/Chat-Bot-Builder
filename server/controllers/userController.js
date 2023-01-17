const users = require("../models/users");

exports.newUser = async (data) => {
  try {
    const user = await users.findOne(data);
    !user && new users(data).save();
  } catch (err) {
    console.log(err);
  }
};

exports.users = async (req, res) => {
  const { botId } = req.params;
  const data = await users
    .find({
      botId,
    })
    .select("userId");
  res.status(200).json({ success: true, data });
};
