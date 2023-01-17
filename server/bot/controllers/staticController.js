const fs = require("fs");
const dest = {
  avatar: "img/avatar/",
  icon: "img/icon/",
  img: "bot/static/img/",
  html: "bot/static/html/",
  css: "bot/static/css/",
  js: "bot/static/js/",
  audio: "bot/static/audio/",
};

exports.staticFiles = (req, res, type) => {
  const file = `${dest[type]}${req.params.file}`;
  if (fs.existsSync(file)) {
    res.sendFile(file, { root: "." });
  } else {
    res.status(404).send("File not found");
  }
};
