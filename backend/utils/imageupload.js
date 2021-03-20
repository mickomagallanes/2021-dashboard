const multer = require("multer");

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// TODO: check magic numbers to determine if it is really an image
function createSingleImageUpload() {
    return (req, res, next) => {

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads')
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + '-' + file.originalname)
            }
        })

        const upload = multer({
            storage: storage,
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: function (_req, file, cb) {
                checkFileType(file, cb);
            }
        }).single("userImgUpload");

        upload(req, res, (err) => {
            if (err) {
                res.json({ "status": false, "msg": err });
            } else {
                next();
            }

        });
    }


}




module.exports = {
    checkFileType,
    createSingleImageUpload
}