const express = require('express');
const router = express.Router();

router.use('/user', require('./apis/api_user'));
router.use('/pagerole', require('./apis/api_pagerole'));
router.use('/role', require('./apis/api_role'));
router.use('/subpage', require('./apis/api_subpage'));
router.use('/menus', require('./apis/api_menus'));

module.exports = router;