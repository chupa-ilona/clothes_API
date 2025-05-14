const User = require('../models/user_model');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні користувачів' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await User.getAll({ id });
        if (!user) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при отриманні користувача' });
    }
};

exports.createUser = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Усі поля username, password, role обов’язкові' });
    }
    if (!['admin', 'worker'].includes(role)) {
        return res.status(400).json({ error: 'Роль має бути \'admin\' або \'worker\'' });
    }
    try {
        const result = await User.create({ username, password, role });
        return res.status(201).json({ id: result.insertId, username, role });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при створенні користувача' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Усі поля username, password, role обов’язкові' });
    }
    if (!['admin', 'worker'].includes(role)) {
        return res.status(400).json({ error: 'Роль має бути \'admin\' або \'worker\'' });
    }
    try {
        const result = await User.update(id, { username, password, role });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Користувача не знайдено' });
        return res.status(200).json({ message: 'Користувача оновлено', id, username, role });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при оновленні користувача' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await User.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Користувача не знайдено' });
        return res.status(200).json({ message: 'Користувача успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні користувача' });
    }
};