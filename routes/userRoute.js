const express = require('express');
const router = express.Router();
const verify = require('./../utilities/middleware/verifyToken');
const access = require('./../utilities/middleware/verifyAccess');

const user = require('../controllers/userController');
router.post('/createUser',access, user.createUser);
router.post('/userlogin',access, user.checkUserCredential);

module.exports = router;
