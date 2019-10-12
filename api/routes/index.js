var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('config');
var auth = jwt({
  secret: config.get('PRIVATE_KEY'),
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/signup', ctrlAuth.signup);
router.post('/login', ctrlAuth.login);
router.get('/verifyEmail/:user_id/:verify_token', ctrlAuth.verifyEmail);
router.post('/isUsernameTaken', ctrlAuth.isUsernameTaken);
router.post('/isEmailTaken', ctrlAuth.isEmailTaken);

module.exports = router;
