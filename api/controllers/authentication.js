var passport = require('passport');
var mongoose = require('mongoose');
var randtoken = require('rand-token');
var User = mongoose.model('User');
const {
  sendMail
} = require('../../mail/mail');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.signup = function(req, res) {

  var user = new User();

  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;
  user.email = req.body.email;
  user.verifyToken = randtoken.generate(32);

  user.setPassword(req.body.password); 
  
  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
    
    sendMail(user, 'Verify user creadentials for Avika');
  });

};

module.exports.login = function(req, res) {
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};

module.exports.verifyEmail = function(req, res) {
  User.findById(req.params.user_id, (err, user) => {
    if (err) return res.send(false);

    console.log('it is good 1');
    if (user.verifyToken === req.params.verify_token) {
      console.log('it is good');
      user.verifiedEmail = true;
        user.save();
        return res.send(true);
    }

    res.send(false);
  });
};

module.exports.isEmailTaken = async function(req, res) {
  let user = await User.findOne({
    email: req.body.email
  });

  res.send(user ? true : false);
}