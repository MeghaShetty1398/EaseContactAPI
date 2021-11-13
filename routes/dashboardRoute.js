const express = require('express');
const router = express.Router();
const verify = require('./../utilities/middleware/verifyToken');
const access = require('./../utilities/middleware/verifyAccess');

const dashboard = require('../controllers/dashboardController');

router.get('/getTotalWork',access,verify, dashboard.getTotalWork);
router.get('/getAcceptedWork',access,verify, dashboard.getAcceptedWork);
router.get('/getRejectedWork',access,verify, dashboard.getRejectedWork);
router.get('/getPendingApprovalWork',access,verify, dashboard.getPendingApprovalWork);
router.get('/getCompletedWork',access,verify, dashboard.getCompletedWork);
router.get('/getNotCompletedWork',access,verify, dashboard.getNotCompletedWork);

module.exports = router;
