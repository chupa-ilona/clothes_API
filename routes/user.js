const express = require('express');

const router = express.Router();
const userController = require('../controllers/user_controllers');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.validateGetUserById, userController.getUserById);
router.post('/', userController.validateCreateUser, userController.createUser);
router.put('/:id', userController.validateUpdateUser, userController.updateUser);
router.delete('/:id', userController.validateDeleteUser, userController.deleteUser);

module.exports = router;
