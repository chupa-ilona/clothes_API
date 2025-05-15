const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/category_controllers');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.validateGetCategoryById, categoryController.getCategoryById);
router.post('/', categoryController.validateCreateCategory, categoryController.createCategory);
router.put('/:id', categoryController.validateUpdateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.validateDeleteCategory, categoryController.deleteCategory);

module.exports = router;
