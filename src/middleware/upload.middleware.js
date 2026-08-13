const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "src/uploads/profile");
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now();
//         cb(null, uniqueName + path.extname(file.originalname))
//     }

// });
const filefilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;
    const isValidExtension = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isvalidMime = allowedTypes.test(file.mimetype);

    if (isValidExtension && isvalidMime) {
        cb(null, true);
    } else {
        cb(new Error("invalid file type"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: filefilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

module.exports = upload;
