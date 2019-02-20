const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/products', productController.getProducts);
router.post('/product', productController.createProduct);


module.exports = router;