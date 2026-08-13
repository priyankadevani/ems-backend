const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const verifyUser = require('../middleware/auth.middleware');
//const authorize = require('../middleware/authorization.middleware');

//router.get('/dashboard', verifyUser, authorize('dashboard.read'), dashboardController.getDashboard);
router.get('/', verifyUser, dashboardController.getDashboard);



module.exports = router;
