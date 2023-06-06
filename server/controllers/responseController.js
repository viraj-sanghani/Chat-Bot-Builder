const response = require("../models/response");

exports.newRes = async (data) => {
  try {
    const resId = Math.round(Math.random() * 1000000);
    const res = new response({ ...data, resId });
    await res.save();
    return resId;
  } catch (err) {
    console.log(err?.message);
    return false;
  }
};

exports.updateRes = async (resId, data) => {
  try {
    const res = await response.findOne({ resId }).select("values");
    if (res) {
      const values = { ...res.values, ...data };
      await response.findOneAndUpdate({ resId }, { values });
      return true;
    }
  } catch (err) {
    console.log(err?.message);
  }
  return false;
};
