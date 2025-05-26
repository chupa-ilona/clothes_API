const { body, param } = require('express-validator');

const Products = require('../models/product_model');
const handleValidationErrors = require('../middleware/validationErrors');

exports.validateCreateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('Назва продукту не може бути порожньою')
        .isLength({ max: 255 }).withMessage('Назва продукту не може перевищувати 255 символів'),
    body('category_id')
        .isInt({ min: 1 }).withMessage('category_id має бути цілим числом більше 0'),
    body('price')
        .isFloat({ min: 0 }).withMessage('Ціна має бути числом більше або рівним 0')
        .custom(value => {
            if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                throw new Error('Ціна може мати максимум 2 знаки після коми');
            }
            return true;
        }),
    handleValidationErrors
];

exports.validateUpdateProduct = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID продукту має бути цілим числом більше 0'),
    body('name')
        .trim()
        .notEmpty().withMessage('Назва продукту не може бути порожньою')
        .isLength({ max: 255 }).withMessage('Назва продукту не може перевищувати 255 символів'),
    body('category_id')
        .isInt({ min: 1 }).withMessage('category_id має бути цілим числом більше 0'),
    body('price')
        .isFloat({ min: 0 }).withMessage('Ціна має бути числом більше або рівним 0')
        .custom(value => {
            if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                throw new Error('Ціна може мати максимум 2 знаки після коми');
            }
            return true;
        }),
    handleValidationErrors
];

exports.validateGetProductById = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID продукту має бути цілим числом більше 0'),
    handleValidationErrors
];

exports.validateDeleteProduct = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID продукту має бути цілим числом більше 0'),
    handleValidationErrors
];

exports.getAllProducts = async (req, res) => {
    try {
        const { name, category_id: categoryId, min_price: minPrice, max_price: maxPrice } = req.query;
        const filters = {};

        if (name) filters.name = `%${name}%`; // Пошук за назвою (LIKE)
        if (categoryId) filters.category_id = parseInt(categoryId, 10);
        if (minPrice) filters.min_price = parseFloat(minPrice);
        if (maxPrice) filters.max_price = parseFloat(maxPrice);

        const products = await Products.getAll(filters);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні продуктів', details: error.message });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const [product] = await Products.getAll({ id });
        if (!product) return res.status(404).json({ error: 'Продукт не знайдено' });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при отриманні продукту', details: error.message });
    }
};

exports.createProduct = async (req, res) => {
    const { name, category_id: categoryId, price } = req.body;
    try {
        const result = await Products.create({ name, category_id: categoryId, price });
        res.status(201).json({ id: result.insertId, name, category_id: categoryId, price });
    } catch (error) {
        res.status(500).json({ error: 'Помилка при створенні продукту', details: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category_id: categoryId, price } = req.body;
    try {
        const result = await Products.update(id, { name, category_id: categoryId, price });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Продукт не знайдено' });
        return res.status(200).json({ message: 'Продукт оновлено', id, name, category_id: categoryId, price });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при оновленні продукту', details: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Products.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Продукт не знайдено' });
        return res.status(200).json({ message: 'Продукт успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні продукту', details: error.message });
    }
};
