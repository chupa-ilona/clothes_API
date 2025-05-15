const express = require('express');

const router = express.Router();
const sizeController = require('../controllers/size_controllers');

router.get('/', sizeController.getAllSizes);
router.get('/:id', sizeController.validateGetSizeById, sizeController.getSizeById);
router.post('/', sizeController.validateCreateSize, sizeController.createSize);
router.put('/:id', sizeController.validateUpdateSize, sizeController.updateSize);
router.delete('/:id', sizeController.validateDeleteSize, sizeController.deleteSize);

module.exports = router;
