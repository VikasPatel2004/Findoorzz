const multer = require('multer');
const path = require('path');

// Multer config to store files in memory for uploading to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images and pdf documents only
  const filetypes = /jpeg|jpg|png|gif|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

module.exports = upload;
