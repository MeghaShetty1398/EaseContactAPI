const express = require('express');
const router = express.Router();
const verify = require('./../utilities/middleware/verifyToken');
const access = require('./../utilities/middleware/verifyAccess');

const worker = require('../controllers/workerController');
router.post('/createWorker',access, worker.createWorker);
router.get('/getWorker',access, worker.getWorker);

module.exports = router;
