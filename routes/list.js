const express = require('express');
const router = express.Router();
const listController = require('../controllers/list');

router.get('/lists', listController.getLists);
router.get('/lists/:listId', listController.getList);
router.post('/list', listController.createList);
router.delete('/delete-list', listController.deleteList);
router.put('/update-list', listController.updateList)

router.put('/product-state', listController.changeState);
router.delete('/delete-list-product', listController.deleteFromList)

module.exports = router;