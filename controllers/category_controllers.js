// controllers/category_controllers.js
const { body, param } = require('express-validator');

const Category = require('../models/category_model');

const handleValidationErrors = require('../middleware/validationErrors');

exports.validateCreateCategory = [
    body('name')
        .trim()
        .notEmpty().withMessage('Назва категорії не може бути порожньою')
        .isLength({ max: 40 }).withMessage('Назва категорії не може перевищувати 40 символів'),
    handleValidationErrors
];

exports.validateUpdateCategory = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID категорії має бути цілим числом більше 0'),
    body('name')
        .trim()
        .notEmpty().withMessage('Назва категорії не може бути порожньою')
        .isLength({ max: 40 }).withMessage('Назва категорії не може перевищувати 40 символів'),
    handleValidationErrors
];

exports.validateGetCategoryById = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID категорії має бути цілим числом більше 0'),
    handleValidationErrors
];

exports.validateDeleteCategory = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID категорії має бути цілим числом більше 0'),
    handleValidationErrors
];

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні категорій', details: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [category] = await Category.getAll({ id });
        if (!category) {
            return res.status(404).json({ error: 'Категорію не знайдено' });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при отриманні категорії', details: error.message });
    }
};

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const result = await Category.create({ name });
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        res.status(500).json({ error: 'Помилка при створенні категорії', details: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = await Category.update(id, { name });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Категорію не знайдено' });
        return res.status(200).json({ message: 'Категорію оновлено', id, name });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при оновленні категорії', details: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Category.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Категорію не знайдено' });
        return res.status(200).json({ message: 'Категорію успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні категорії', details: error.message });
    }
};
