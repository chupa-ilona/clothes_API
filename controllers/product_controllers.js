const Products = require('../models/product_model');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Products.getAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні продуктів' });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const [product] = await Products.getAll({ id });
        if (!product) return res.status(404).json({ error: 'Продукт не знайдено' });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при отриманні продукту' });
    }
};

exports.createProduct = async (req, res) => {
    const { name, category_id, price } = req.body;
    if (!name || !category_id || price == null) {
        return res.status(400).json({ error: 'Усі поля name, category_id, price обов’язкові' });
    }
    try {
        const result = await Products.create({ name, category_id, price });
        return res.status(201).json({ id: result.insertId, name, category_id, price });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при створенні продукту' });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category_id, price } = req.body;
    if (!name || !category_id || price == null) {
        return res.status(400).json({ error: 'Усі поля name, category_id, price обов’язкові' });
    }
    try {
        const result = await Products.update(id, { name, category_id, price });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Продукт не знайдено' });
        return res.status(200).json({ message: 'Продукт оновлено', id, name, category_id, price });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при оновленні продукту' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Products.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Продукт не знайдено' });
        return res.status(200).json({ message: 'Продукт успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні продукту' });
    }
};