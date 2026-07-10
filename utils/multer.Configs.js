const multer = require("multer");

const storage = multer.diskStorage({
  //   destination: (req, file, cb) => cb(null, "tmp/"),
  //   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

//const path = require("path");

// const fileFilter = (req, file, cb) => {
//   const allowedExtensions = [".jpg", ".jpeg", ".png", ".jfif"];

//   const ext = path.extname(file.originalname).toLowerCase();

//   if (allowedExtensions.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPG, JPEG and PNG images are allowed."), false);
//   }
// };

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  // fileFilter,
});

module.exports = { upload };
