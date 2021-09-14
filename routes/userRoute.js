const express = require('express');
const router = express.Router();
const verify = require('./../utilities/middleware/verifyToken');
const access = require('./../utilities/middleware/verifyAccess');

const user = require('../controllers/userController');
router.post('/createUser',access, user.createUser);
router.post('/login',access, user.checkCredential);

module.exports = router;
