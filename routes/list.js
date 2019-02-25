const express = require('express');
const router = express.Router();
const listController = require('../controllers/list');
const isAuth = require('../middleware/is-auth'); 

router.get('/lists', isAuth, listController.getLists);
router.get('/lists/:listId', isAuth, listController.getList);
router.post('/list', isAuth, listController.createList);
router.delete('/delete-list', isAuth, listController.deleteList);
router.put('/update-list', isAuth, listController.updateList)

router.put('/product-state', isAuth, listController.changeState);
router.delete('/delete-list-product', isAuth, listController.deleteFromList)

module.exports = router;