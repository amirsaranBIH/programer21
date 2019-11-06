var mongoose = require('mongoose');
var Course = mongoose.model('Course');

module.exports.createCourse = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message : 'UnauthorizedError: private course',
      status: false
    });
  } else {
    const newCourse = new Course({
      title: req.body.title,
      description: req.body.description,
      creator: req.payload._id
    });
    
    newCourse.save(err => {
      res.json({
        status: true
      });
    });
  }
};

module.exports.getAllCourses = function(req, res) {
  Course.find({}).populate({ 
    path: 'modules',
    populate: {
      path: 'lectures',
      model: 'Lecture'
    } 
 }).exec((err, courses) => {
    if (err) {
      console.error(err);
    }

    res.json(courses);
  });
};
