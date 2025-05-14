const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory_controllers');

router.get('/', inventoryController.getInventory); // Змінено на getInventory
router.get('/:id', inventoryController.getInventoryById);
router.post('/', inventoryController.createInventory);
router.put('/:id', inventoryController.updateInventory);
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router;