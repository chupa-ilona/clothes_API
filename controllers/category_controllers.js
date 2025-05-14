// controllers/category_controllers.js

const Category = require('../models/category_model');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні категорій' });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const [category] = await Category.getAll({ category_id: req.params.id }); // Адаптуйте до вашого методу
        if (!category) return res.status(404).json({ error: 'Категорію не знайдено' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні категорії' });
    }
};

exports.createCategory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Поле name обов’язкове' });
    }

    try {
        const result = await Category.create({ name });
        return res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при створенні категорії' });
    }
};

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Поле name обов’язкове' });
    }

    try {
        const result = await Category.update(id, { name });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Категорію не знайдено' });
        res.status(200).json({ message: 'Категорію оновлено', id, name });
    } catch (error) {
        res.status(500).json({ error: 'Помилка при оновленні категорії' });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Category.delete(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Категорію не знайдено' });
        }

        return res.status(200).json({ message: 'Категорію успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні категорії' });
    }
};