const express = require('express');
const router = express.Router();
const verify = require('./../utilities/middleware/verifyToken');
const access = require('./../utilities/middleware/verifyAccess');

const assignwork = require('../controllers/assignworkController');

router.post('/createAssignWork',access,verify, assignwork.createAssignWorker);
router.get('/getUserWork',access,verify, assignwork.getUserWork);

router.get('/getWorkerWork',access,verify, assignwork.getWorkerWork);
router.post('/updateAccepted',access,verify, assignwork.updateAccepted);
router.post('/updateRejected',access,verify, assignwork.updateRejected);

module.exports = router;
