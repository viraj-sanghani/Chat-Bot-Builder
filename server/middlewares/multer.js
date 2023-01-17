const multer = require("multer");

const profileUploads = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "img/avatar");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + ".jpg");
    },
  }),
});

const botIconUploads = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "img/icon");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + ".jpg");
    },
  }),
});

profile = profileUploads.single("picture");
botIcon = botIconUploads.single("icon");

module.exports = {
  profile,
  botIcon,
};
