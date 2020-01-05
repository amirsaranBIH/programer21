var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('config');
var upload = require('../setup/file-upload');
var auth = jwt({
  secret: config.get('PRIVATE_KEY'),
  userProperty: 'payload'
});

var ctrlDashboard = require('../controllers/dashboard');
var ctrlAuth = require('../controllers/authentication');
var ctrlCourse = require('../controllers/course');
var ctrlModule = require('../controllers/module');
var ctrlLecture = require('../controllers/lecture');

// dashboard
router.get('/dashboard', auth, ctrlDashboard.dashboardRead);

// authentication
router.post('/signup', ctrlAuth.signup);
router.post('/login', ctrlAuth.login);
router.get('/verifyEmail/:user_id/:verify_token', ctrlAuth.verifyEmail);
router.post('/isEmailTaken', ctrlAuth.isEmailTaken);

// course
router.get('/course/get-all-courses', ctrlCourse.getAllCourses);
router.get('/course/get-course/:course_id', ctrlCourse.getCourseById);
router.post('/course/new', auth, upload('image', 'course-images'), ctrlCourse.createCourse);
router.post('/course/edit/:course_id', auth, upload('image', 'course-images'), ctrlCourse.editCourse);
router.post('/course/delete/:course_id', auth, ctrlCourse.deleteCourse);
router.get('/course/enroll/:course_id', auth, ctrlCourse.enrollInCourse);

// module
router.get('/module/get-all-modules', ctrlModule.getAllModules);
router.get('/module/get-module/:module_id', ctrlModule.getModuleById);
router.post('/module/new/:course_id', auth, upload('image', 'module-images'), ctrlModule.createModule);
router.post('/module/edit/:module_id', auth, upload('image', 'module-images'), ctrlModule.editModule);
router.post('/module/delete/:module_id', auth, ctrlModule.editModule);

// lecture
router.get('/lecture/get-all-lectures', ctrlLecture.getAllLectures);
router.get('/lecture/get-lecture/:lecture_id', ctrlLecture.getLectureById);
router.get('/lecture/get-lecture-by-slug/:slug', ctrlLecture.getLectureBySlug);
router.get('/lecture/get-lecture-html-content-by-slug/:slug', ctrlLecture.getLectureHTMLContentBySlug);
router.post('/lecture/new/:module_id', auth, ctrlLecture.createLecture);
router.post('/lecture/edit/:lecture_id', auth, ctrlLecture.editLecture);
router.post('/lecture/delete/:lecture_id', auth, ctrlLecture.editLecture);
router.get('/lecture/skip/:course_index/:module_next_index/:lecture_next_index', auth, ctrlLecture.skipLecture);
router.get('/lecture/finish/:course_index/:module_next_index/:lecture_next_index', auth, ctrlLecture.finishLecture);

module.exports = router;
