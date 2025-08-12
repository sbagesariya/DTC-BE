const router = require('express').Router();
const bannerController = require('../services/banner/bannerController');

router.get('/:id', bannerController.getBannerDetails);

module.exports = router;
