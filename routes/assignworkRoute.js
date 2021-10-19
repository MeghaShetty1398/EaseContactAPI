const express = require('express');
const router = express.Router();
const verify = require('./../utilities/middleware/verifyToken');
const access = require('./../utilities/middleware/verifyAccess');

const assignwork = require('../controllers/assignworkController');

router.post('/createAssignWork',access,verify, assignwork.createAssignWorker);

module.exports = router;
