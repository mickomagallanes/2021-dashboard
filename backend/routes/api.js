const express = require('express');
const router = express.Router();

router.use('/user', require('./apis/api_user'));
router.use('/pagerole', require('./apis/api_pagerole'));
router.use('/role', require('./apis/api_role'));

module.exports = router;