const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const isAuth = require('../middleware/is-auth'); 

router.get('/products', isAuth, productController.getProducts);
router.post('/product', isAuth, productController.createProduct);


module.exports = router;