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
var ctrlCourse = require('../controllers/course');
var ctrlModule = require('../controllers/module');

// dashboard
router.get('/dashboard', auth, ctrlDashboard.dashboardRead);

// authentication
router.post('/signup', ctrlAuth.signup);
router.post('/login', ctrlAuth.login);
router.get('/verifyEmail/:user_id/:verify_token', ctrlAuth.verifyEmail);
router.post('/isEmailTaken', ctrlAuth.isEmailTaken);

// course
router.get('/course/get-all-courses', ctrlCourse.getAllCourses);
router.post('/course/new', auth, ctrlCourse.createCourse);

// module
router.get('/module/get-all-modules', ctrlModule.getAllModules);
router.post('/module/new/:course_id', auth, ctrlModule.createModule);

module.exports = router;
