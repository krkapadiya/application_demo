require("fs");
require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Directory for file uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedFilename = file.originalname
      .replace(/\s+/g, "-")
      .toLowerCase(); // Replace spaces with hyphens
    cb(null, uniqueSuffix + "-" + sanitizedFilename); // Generate unique file name
  },
});

// Multer setup
const upload = multer({
  storage: storage,
});

module.exports = { upload };
