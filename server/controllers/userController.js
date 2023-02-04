const { insert, findOne, find } = require("../config/db");
exports.newUser = async (data) => {
  try {
    const user = await findOne("users", {
      botId: data?.botId,
      userId: data?.userId,
    });
    !user && (await insert("users", data));
  } catch (err) {
    console.log(err);
  }
};

exports.users = async (req, res) => {
  const { botId } = req.params;
  const data = await find(
    "users",
    {
      botId,
    },
    "userId name"
  );
  res.status(200).json({ success: true, data });
};

exports.userInfo = async (req, res) => {
  const { userId } = req.params;
  const data = await findOne(
    "users",
    {
      userId,
    },
    "userId name email mobile"
  );
  res.status(200).json({ success: true, data });
};
