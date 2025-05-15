const { body, param } = require('express-validator');
const User = require('../models/user_model');
const handleValidationErrors = require('../middleware/validationErrors');

exports.validateCreateUser = [
    body('username')
        .trim()
        .notEmpty().withMessage('Ім’я користувача не може бути порожнім')
        .isLength({ max: 100 }).withMessage('Ім’я користувача не може перевищувати 100 символів'),
    body('password')
        .trim()
        .notEmpty().withMessage('Пароль не може бути порожнім')
        .isLength({ min: 8, max: 255 }).withMessage('Пароль має бути від 8 до 255 символів'),
    body('role')
        .isIn(['admin', 'worker']).withMessage('Роль має бути \'admin\' або \'worker\''),
    handleValidationErrors
];

exports.validateUpdateUser = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID користувача має бути цілим числом більше 0'),
    body('username')
        .trim()
        .notEmpty().withMessage('Ім’я користувача не може бути порожнім')
        .isLength({ max: 100 }).withMessage('Ім’я користувача не може перевищувати 100 символів'),
    body('password')
        .trim()
        .notEmpty().withMessage('Пароль не може бути порожнім')
        .isLength({ min: 8, max: 255 }).withMessage('Пароль має бути від 8 до 255 символів'),
    body('role')
        .isIn(['admin', 'worker']).withMessage('Роль має бути \'admin\' або \'worker\''),
    handleValidationErrors
];

exports.validateGetUserById = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID користувача має бути цілим числом більше 0'),
    handleValidationErrors
];

exports.validateDeleteUser = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID користувача має бути цілим числом більше 0'),
    handleValidationErrors
];

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні користувачів', details: error.message });
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
        return res.status(500).json({ error: 'Помилка при отриманні користувача', details: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const result = await User.create({ username, password, role });
        res.status(201).json({ id: result.insertId, username, role });
    } catch (error) {
        res.status(500).json({ error: 'Помилка при створенні користувача', details: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;
    try {
        const result = await User.update(id, { username, password, role });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }
        return res.status(200).json({ message: 'Користувача оновлено', id, username, role });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при оновленні користувача', details: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await User.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Користувача не знайдено' });
        return res.status(200).json({ message: 'Користувача успішно видалено' });
    } catch (error) {
        return res.status(500).json({ error: 'Помилка при видаленні користувача', details: error.message });
    }
};
