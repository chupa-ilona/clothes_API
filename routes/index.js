const express = require('express');

const router = express.Router();
const categoryRoutes = require('./category');
const inventoryRoutes = require('./inventory');
const productRoutes = require('./product');
const sizeRoutes = require('./size');
const usersRoutes = require('./user');

// Додайте маршрут для кореня
router.get('/', (req, res) => {
    res.render('index');
});

// Підключення інших маршрутів
router.use('/category', categoryRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/product', productRoutes);
router.use('/size', sizeRoutes);
router.use('/users', usersRoutes);

module.exports = router;