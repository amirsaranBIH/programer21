var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('config');
var auth = jwt({
  secret: config.get('PRIVATE_KEY'),
  userProperty: 'payload'
});

var ctrlDashboard = require('../controllers/dashboard');
var ctrlAuth = require('../controllers/authentication');

// dashboard
router.get('/dashboard', auth, ctrlDashboard.dashboardRead);

// authentication
router.post('/signup', ctrlAuth.signup);
router.post('/login', ctrlAuth.login);
router.get('/verifyEmail/:user_id/:verify_token', ctrlAuth.verifyEmail);
router.post('/isEmailTaken', ctrlAuth.isEmailTaken);

module.exports = router;
