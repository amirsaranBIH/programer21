var mongoose = require('mongoose');
var Course = mongoose.model('Course');

module.exports.createCourse = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({ status: false });
  } else {
    const newCourse = new Course({
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      status: req.body.status,
      creator: req.payload._id
    });

    if (req.body.thumbnail.trim()) {
      newCourse.thumbnail = req.body.thumbnail;
    }
    
    newCourse.save(err => {
      if (err) {
        console.error(err);
      }
      res.json({
        status: true
      });
    });
  }
};

module.exports.editCourse = function(req, res) {
  if (!req.payload._id) {
      res.status(401).json({ status: false });
  } else {
    Course.findByIdAndUpdate(req.params.course_id, req.body, (err) => {
          if (err) {
              console.error(err)
          }

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

module.exports.getCourseById = function(req, res) {
  Course.findById(req.params.course_id, (err, course) => {
      if (err) {
          console.error(err);
      }

      res.json(course);
  });
};
