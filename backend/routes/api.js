const express = require('express');
const router = express.Router();

router.use('/user', require('./apis/api_user'));
router.use('/pagerole', require('./apis/api_pagerole'));

module.exports = router;