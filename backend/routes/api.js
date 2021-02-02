const express = require('express');
const router = express.Router();

router.use('/user', require('./apis/api_user'));

module.exports = router;