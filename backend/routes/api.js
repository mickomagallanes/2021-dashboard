const express = require('express');
const router = express.Router();

router.use('/barangay', require('./apis/api_barangay'));
router.use('/city', require('./apis/api_city'));
router.use('/province', require('./apis/api_province'));
router.use('/route', require('./apis/api_route'));
router.use('/toda', require('./apis/api_toda'));

module.exports = router;