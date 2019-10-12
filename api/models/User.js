var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('config');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  verifiedEmail: {
    type: Boolean,
    default: false,
    required: true
  },
  verifyToken: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
    required: true
  },
  picture: {
    type: String,
    default: 'default_profile_picture.jpg',
    get: image => {
        return '/images/user_pictures/' + image;
    },
    required: true
  },
  categoriesEnrolledIn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    modulesEnrolledIn: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      lecturesEnrolledIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
      }
    }]
  }],
  categoriesFinished: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    modulesFinished: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      lecturesFinished: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
      }
    }]
  }],
  modulesSkipped: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  lecturesSkipped: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  lastTimeLoggedIn: {
    type: Date,
    default: Date.now,
    required: true
  }
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    verifiedEmail: this.verifiedEmail,
    picture: this.picture,
    role: this.role,
    exp: parseInt(expiry.getTime() / 1000),
  }, config.get('PRIVATE_KEY'));
};

mongoose.model('User', userSchema);
