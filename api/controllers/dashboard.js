var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.dashboardRead = function(req, res) {
  if (!req.payload._id) {
    return res.status(401).json({
      "message" : "UnauthorizedError: private dashboard"
    });
  }

  User
  .findById(req.payload._id, '-verifyToken -hash -salt -__v')
  .populate({
    path: 'coursesEnrolledIn.course',
    populate: {
      path: 'modules',
      populate: {
        path: 'lectures',
        model: 'Lecture'
      }
    }
  })
  .exec((err, user) => {
    if (err) throw err;
    
    res.status(200).json(user);
  });
};
