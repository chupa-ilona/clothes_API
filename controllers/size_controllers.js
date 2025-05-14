const Size = require('../models/size_model');

exports.getAllSizes = async (req, res) => {
    try {
        const sizes = await Size.getAll();
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні розмірів' });
    }
};

exports.getSizeById = async (req, res) => {
    const { id } = req.params;
    try {
        const [size] = await Size.getAll({ id });
        if (!size) return res.status(404).json({ error: 'Розмір не знайдено' });
        return res.status(200).json(size);
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при отриманні розміру' });
    }
};

exports.createSize = async (req, res) => {
    const { id, description } = req.body;
    if (!id || description == null) {
        return res.status(400).json({ error: 'Поля id та description обов’язкові' });
    }
    try {
        await Size.create({ id, description });
        return res.status(201).json({ id, description });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при створенні розміру' });
    }
};

exports.updateSize = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    if (description == null) {
        return res.status(400).json({ error: 'Поле description обов’язкове' });
    }
    try {
        const result = await Size.update(id, { description });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Розмір не знайдено' });
        return res.status(200).json({ message: 'Розмір оновлено', id, description });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при оновленні розміру' });
    }
};

exports.deleteSize = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Size.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Розмір не знайдено' });
        return res.status(200).json({ message: 'Розмір успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні розміру' });
    }
};