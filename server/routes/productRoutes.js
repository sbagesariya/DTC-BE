const router = require('express').Router();
const productsController = require('../services/products/productsController');

router.get('/lists', productsController.getProducts);

module.exports = router;