const express = require('express');

const router = express.Router();
const inventoryController = require('../controllers/inventory_controllers');

router.get('/', inventoryController.getInventory);
router.get('/:id', inventoryController.validateGetInventoryById, inventoryController.getInventoryById);
router.post('/', inventoryController.validateCreateInventory, inventoryController.createInventory);
router.put('/:id', inventoryController.validateUpdateInventory, inventoryController.updateInventory);
router.delete('/:id', inventoryController.validateDeleteInventory, inventoryController.deleteInventory);

module.exports = router;
