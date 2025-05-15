// controllers/inventory_controllers.js

const { body, param } = require('express-validator');

const Inventory = require('../models/inventory_model');

const handleValidationErrors = require('../middleware/validationErrors');

exports.validateCreateInventory = [
    body('product_id')
        .isInt({ min: 1 }).withMessage('product_id має бути цілим числом більше 0'),
    body('size_id')
        .trim()
        .notEmpty().withMessage('size_id не може бути порожнім')
        .isLength({ max: 10 }).withMessage('size_id не може перевищувати 10 символів'),
    body('quantity')
        .isInt({ min: 0 }).withMessage('Кількість має бути цілим числом більше або рівним 0'),
    handleValidationErrors
];

exports.validateUpdateInventory = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID запису інвентарю має бути цілим числом більше 0'),
    body('product_id')
        .isInt({ min: 1 }).withMessage('product_id має бути цілим числом більше 0'),
    body('size_id')
        .trim()
        .notEmpty().withMessage('size_id не може бути порожнім')
        .isLength({ max: 10 }).withMessage('size_id не може перевищувати 10 символів'),
    body('quantity')
        .isInt({ min: 0 }).withMessage('Кількість має бути цілим числом більше або рівним 0'),
    handleValidationErrors
];

exports.validateGetInventoryById = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID запису інвентарю має бути цілим числом більше 0'),
    handleValidationErrors
];

exports.validateDeleteInventory = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID запису інвентарю має бути цілим числом більше 0'),
    handleValidationErrors
];

exports.getInventory = async (req, res) => {
    try {
        const data = await Inventory.getAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні складу', details: error.message });
    }
};

exports.getInventoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [item] = await Inventory.getAll({ inventory_id: id });
        if (!item) return res.status(404).json({ error: 'Запис не знайдено' });
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при отриманні запису', details: error.message });
    }
};

exports.createInventory = async (req, res) => {
    const { product_id: productId, size_id: sizeId, quantity } = req.body;
    try {
        const result = await Inventory.create({ product_id: productId, size_id: sizeId, quantity });
        return res.status(201).json({ id: result.insertId, product_id: productId, size_id: sizeId, quantity });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при створенні запису на складі', details: error.message });
    }
};

exports.updateInventory = async (req, res) => {
    const { id } = req.params;
    const { product_id: productId, size_id: sizeId, quantity } = req.body;
    try {
        const result = await Inventory.update(id, { product_id: productId, size_id: sizeId, quantity });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Запис не знайдено' });
        }
        return res.status(200).json({ message: 'Запис оновлено', id, product_id: productId, size_id: sizeId, quantity });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при оновленні запису', details: error.message });
    }
};

exports.deleteInventory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Inventory.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Запис не знайдено' });
        return res.status(200).json({ message: 'Запис успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні запису', details: error.message });
    }
};
