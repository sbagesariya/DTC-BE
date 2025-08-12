const router = require('express').Router();
const brandsController = require('../services/brand/brandController');

router.get('/:id', brandsController.getBrandDetails);

module.exports = router;