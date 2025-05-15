const express = require('express');

const router = express.Router();
const productController = require('../controllers/product_controllers');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.validateGetProductById, productController.getProductById);
router.post('/', productController.validateCreateProduct, productController.createProduct);
router.put('/:id', productController.validateUpdateProduct, productController.updateProduct);
router.delete('/:id', productController.validateDeleteProduct, productController.deleteProduct);

module.exports = router;
