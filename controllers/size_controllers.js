
const { body, param } = require('express-validator');
const Size = require('../models/size_model');

const handleValidationErrors = require('../middleware/validationErrors');

exports.validateCreateSize = [
    body('id')
        .trim()
        .notEmpty().withMessage('ID розміру не може бути порожнім')
        .isLength({ max: 10 }).withMessage('ID розміру не може перевищувати 10 символів'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 40 }).withMessage('Опис розміру не може перевищувати 40 символів'),
    handleValidationErrors
];

exports.validateUpdateSize = [
    param('id')
        .trim()
        .notEmpty().withMessage('ID розміру не може бути порожнім')
        .isLength({ max: 10 }).withMessage('ID розміру не може перевищувати 10 символів'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 40 }).withMessage('Опис розміру не може перевищувати 40 символів'),
    handleValidationErrors
];

exports.validateGetSizeById = [
    param('id')
        .trim()
        .notEmpty().withMessage('ID розміру не може бути порожнім')
        .isLength({ max: 10 }).withMessage('ID розміру не може перевищувати 10 символів'),
    handleValidationErrors
];

exports.validateDeleteSize = [
    param('id')
        .trim()
        .notEmpty().withMessage('ID розміру не може бути порожнім')
        .isLength({ max: 10 }).withMessage('ID розміру не може перевищувати 10 символів'),
    handleValidationErrors
];

exports.getAllSizes = async (req, res) => {
    try {
        const sizes = await Size.getAll();
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні розмірів', details: error.message });
    }
};

exports.getSizeById = async (req, res) => {
    const { id } = req.params;
    try {
        const [size] = await Size.getAll({ id });
        if (!size) return res.status(404).json({ error: 'Розмір не знайдено' });
        return res.status(200).json(size);
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при отриманні розміру', details: error.message });
    }
};

exports.createSize = async (req, res) => {
    const { id, description } = req.body;
    try {
        await Size.create({ id, description });
        res.status(201).json({ id, description });
    } catch (error) {
        res.status(500).json({ error: 'Помилка при створенні розміру', details: error.message });
    }
};

exports.updateSize = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        const result = await Size.update(id, { description });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Розмір не знайдено' });
        return res.status(200).json({ message: 'Розмір оновлено', id, description });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при оновленні розміру', details: error.message });
    }
};

exports.deleteSize = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Size.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Розмір не знайдено' });
        return res.status(200).json({ message: 'Розмір успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні розміру', details: error.message });
    }
};
