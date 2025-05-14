const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/category_controllers');

router.get('/', categoryController.getCategories); // Змінено на getCategories
router.get('/:id', categoryController.getCategoryById); // Потрібно додати в контролер
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory); // Потрібно додати в контролер
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;