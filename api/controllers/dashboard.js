var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.dashboardRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private dashboard"
    });
  } else {
    User
      .findById(req.payload._id)
      .select('-verifyToken -hash -salt -__v')
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }

};
