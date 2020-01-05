const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const User = mongoose.model('User');
const config = require('config');
const { extractUploadPathFromUrl, nextCourseIndexNumber } = require('../helpers/shared');
const { deleteFile } = require('../helpers/file');

module.exports.createCourse = async function (req, res) {
  if (!req.payload._id) {
    return res.status(401).json({ status: false });
  }

  const nextIndex = await nextCourseIndexNumber();

  const newCourse = new Course({
    title: req.body.title,
    slug: req.body.slug,
    description: req.body.description,
    difficulty: req.body.difficulty,
    status: req.body.status,
    creator: req.payload._id,
    index_number: nextIndex
  });

  if (req.file) {
    newCourse.image = config.get('HOST') + req.file.destination + '/' + req.file.filename;
  }

  newCourse.save(err => {
    if (err) throw err;
    res.json({
      status: true
    });
  });

};

module.exports.editCourse = function (req, res) {
  if (!req.payload._id) {
    res.status(401).json({ status: false });
  }

  
  Course.findById(req.params.course_id, (err, course) => {
    if (err) {
      console.error(err)
    }

    if (req.file) {
      req.body.image = config.get('HOST') + req.file.destination + '/' + req.file.filename;
      deleteFile(extractUploadPathFromUrl(course.image));
    }
    
    course.update(req.body, (err) => {
      if (err) throw err;
    });
    
    res.json({ status: true });
  });
};

module.exports.getAllCourses = function (req, res) {
  Course.find().populate({
    path: 'modules',
    populate: {
      path: 'lectures',
      model: 'Lecture'
    }
  }).exec((err, courses) => {
    if (err) throw err;

    res.json(courses);
  });
};

module.exports.getCourseById = function (req, res) {
  Course.findById(req.params.course_id, (err, course) => {
    if (err) throw err;

    res.json(course);
  });
};

module.exports.deleteCourse = function (req, res) {
  Course.findOneAndDelete(req.params.course_id, err => {
    if (err) throw err;

    res.json({ status: true });
  });
};

module.exports.enrollInCourse = function (req, res) {
  if (!req.payload._id) {
    res.status(401).json({ status: false });
  }

  User.findByIdAndUpdate(req.payload._id, 
    { $push: 
      { 
        coursesEnrolledIn: {
          course: req.params.course_id
        } 
      }
    },
    err => {
    if (err) throw err;

    res.json({ status: true });
  });
};
