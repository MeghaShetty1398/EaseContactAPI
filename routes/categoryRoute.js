const express = require('express');
const router = express.Router();
const verify = require('./../utilities/middleware/verifyToken');
const access = require('./../utilities/middleware/verifyAccess');

const category = require('../controllers/categoryController');

router.get('/getAllCategory',access,verify, category.getAllCategory);
router.post('/createCategory',access,verify, category.createCategory);
router.post('/updateCategory',access,verify, category.updateCategory);
router.post('/deleteCategory',access,verify, category.deleteCategory);

module.exports = router;
