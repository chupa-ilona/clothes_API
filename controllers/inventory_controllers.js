// controllers/inventory_controllers.js

const Inventory = require('../models/inventory_model');

exports.getInventory = async (req, res) => {
    try {
        const data = await Inventory.getAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні складу' });
    }
};

exports.getInventoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [item] = await Inventory.getAll({ inventory_id: id });
        if (!item) return res.status(404).json({ error: 'Запис не знайдено' });
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при отриманні запису' });
    }
};

exports.createInventory = async (req, res) => {
    const { product_id: productId, size_id: sizeId, quantity } = req.body;

    if (!productId || !sizeId || quantity == null) {
        return res.status(400).json({ error: 'Усі поля product_id, size_id, quantity обов’язкові' });
    }

    try {
        const result = await Inventory.create({ product_id: productId, size_id: sizeId, quantity });
        return res.status(201).json({ id: result.insertId, product_id: productId, size_id: sizeId, quantity });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при створенні запису на складі' });
    }
};

exports.updateInventory = async (req, res) => {
    const { id } = req.params;
    const { product_id: productId, size_id: sizeId, quantity } = req.body;

    if (!productId || !sizeId || quantity == null) {
        return res.status(400).json({ error: 'Усі поля product_id, size_id, quantity обов’язкові' });
    }

    try {
        const result = await Inventory.update(id, { product_id: productId, size_id: sizeId, quantity });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Запис не знайдено' });
        return res.status(200).json({ message: 'Запис оновлено', id, product_id: productId, size_id: sizeId, quantity });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при оновленні запису' });
    }
};

exports.deleteInventory = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Inventory.delete(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Запис не знайдено' });
        }

        return res.status(200).json({ message: 'Запис успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні запису' });
    }
};