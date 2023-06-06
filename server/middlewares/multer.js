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
      cb(null, "bot/static/icon");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + ".jpg");
    },
  }),
});

const widgetItemUploads = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `bot/static/widget`); // /${req.params.botId}/${req.params.type}
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() +
          Math.round(Math.random() * 100000) +
          "." +
          file.originalname.split(".").pop()
      );
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/x-matroska" ||
      file.mimetype == "application/vnd.ms-excel" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype == "application/msword" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error(
        "Only .png, .jpg, .jpeg, .mp4, .mkv, .xls, .xlsx, .doc, .docx and .pdf format allowed!"
      );
      return cb(err);
    }
  },
});

profile = profileUploads.single("picture");
botIcon = botIconUploads.single("icon");
widgetItem = widgetItemUploads.array("file");

module.exports = {
  profile,
  botIcon,
  widgetItem,
};
