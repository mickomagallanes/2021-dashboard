"use strict";
const UserService = require('../../services/UserService.js');

const utils = require('../../utils/session.js');
const { checkFileType } = require('../../utils/imageupload.js');
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const { userInsertSchema, userLoginSchema, userGetAllSchema, userModifySchema } = require('../../middlewares/validator.js');
const express = require('express');
const router = express.Router();

router.get('/get/all', [checkSession, userGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let result = await UserService.getAllUser(req.query);
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "data": result });
    }
});

router.get('/get/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {
    let result = await UserService.getUserById(req.params.id);
    if (result === false) {
        res.json({ "status": false });
    } else {
        res.json({ "status": true, "data": result });
    }
});

router.get('/get/all/count', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await UserService.getAllCount();
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "data": result });
    }
});

router.post('/insert', [checkSession, userInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert username, password and role id
    let result = await UserService.insertUser(req.body);
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "msg": "Success" });
    }
});

router.put('/modify', [checkSession, userModifySchema, authorizeWriteRoute], async function (req, res, next) {

    // insert username, password and role id
    let result = await UserService.modifyUser(req.body);
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "msg": "Success" });
    }
});

router.post('/login', userLoginSchema, async function (req, res, next) {

    if (req.session.userData) {

        res.json({ "status": false, "msg": "Already logged in!" });
    } else {
        utils.clearCookie(res);

        // check if user credentials are true
        let result = await UserService.loginUser(req.body);

        if (result.status === false) {
            res.json({ "status": false, "msg": "Credentials is incorrect" });
        } else {
            req.session.userData = result.data;

            res.json({ "status": true, "msg": "Login successful" });
        }
    }

});

router.get('/cookie', async function (req, res, next) {

    if (req.session.userData) {
        res.json({ "status": true, "msg": "Cookie exists" });
    } else {
        utils.clearCookie(res);
        res.json({ "status": false, "msg": "Cookie does not exist" });

    }

});

//TODO: make image upload
// const multer = require("multer");

// const handleError = (err, res) => {
//     res
//         .status(500)
//         .contentType("text/plain")
//         .end("Oops! Something went wrong!");
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1000 * 1000 // 5mb},
//     fileFilter: function (_req, file, cb) {
//         checkFileType(file, cb);
//     }
//     // you might also want to set some limits: https://github.com/expressjs/multer#limits
// }).single("userImgUpload");


// router.post("/upload", [checkSession, authorizeWriteRoute], (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             res.json({ "status": false, "msg": err });
//         } else {
//             // res.send(req.file);

//             const tempPath = req.file.path;
//             const targetPath = path.join(__dirname, "public/uploads/tempImg8E1F.png");

//             if (path.extname(req.file.originalname).toLowerCase() === ".png") {
//                 fs.rename(tempPath, targetPath, err => {
//                     if (err) return handleError(err, res);

//                     res
//                         .status(200)
//                         .contentType("text/plain")
//                         .end("File uploaded!");
//                 });
//             } else {
//                 fs.unlink(tempPath, err => {
//                     if (err) return handleError(err, res);

//                     res
//                         .status(403)
//                         .contentType("text/plain")
//                         .end("Only .png files are allowed!");
//                 });
//             }
//         }

//     });

// }
// );

module.exports = router;