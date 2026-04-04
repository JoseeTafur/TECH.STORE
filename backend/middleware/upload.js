const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Si el campo es 'image' va a productos, si es 'profilePic' a perfiles
    const folder = file.fieldname === 'image' ? 'uploads/products/' : 'uploads/profiles/';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
module.exports = upload;