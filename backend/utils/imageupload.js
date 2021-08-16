const multer = require("multer");
const path = require('path');
const FileType = require('file-type');
const fs = require('fs')

async function checkFileType(file, res, next) {

    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (!(mimetype && extname)) {
        res.json({ "status": false, "msg": 'Error: Images Only!' });
    }

    const newFileName = file.filename;

    const oldPath = `tmp/${newFileName}`;
    const newPath = `public/uploads/${newFileName}`;

    // check file type with magic number
    const fileTypeDeep = await FileType.fromFile(oldPath);
    let isValidFile;

    if (fileTypeDeep != undefined) {
        isValidFile = filetypes.test(fileTypeDeep.ext);
    }

    if (isValidFile) {
        // move from tmp to public/uploads
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                res.json({ "status": false, "msg": err });
            } else {
                next();
            }

        })
    } else {
        fs.unlink(oldPath, function (err) {
            if (err) { console.error(err); }
            else {
                res.json({ "status": false, "msg": "File Type is invalid" });
            }
        });

    }


}

// @param {String} imgId matches the formdata id for the image
function createSingleImageUpload(imgId) {
    return (req, res, next) => {

        // upload temporary image
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'tmp');
            },
            filename: (req, file, cb) => {
                let newFileName = Date.now() + '-' + file.originalname;
                cb(null, newFileName);
            }
        })

        const upload = multer({
            storage: storage,
            limits: { fileSize: 5 * 1024 * 1024 }
        }).single(imgId);

        upload(req, res, (err) => {
            if (err) {
                res.json({ "status": false, "msg": err });
            } else {
                checkFileType(req.file, res, next);
            }

        });

    }


}




module.exports = {
    checkFileType,
    createSingleImageUpload
}