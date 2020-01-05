const multer = require('multer');
const config = require('config');

module.exports = function(fieldname, destFolder) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, config.get('UPLOAD_FOLDER') + destFolder);
    },
    filename: (req, file, cb) => {
      cb(null,  Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter(req, file, cb) {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg, .jpeg and .gif format allowed!'));
      }
    }
  });

  return upload.single(fieldname);
};
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, config.get('UPLOAD_FOLDER'));
//   },
//   filename: (req, file, cb) => {
//     cb(null,  Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   },
//   fileFilter(req, file, cb) {
//     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//     }
//   }

// });

// module.exports = upload;