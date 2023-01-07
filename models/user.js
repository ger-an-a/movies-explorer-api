const { mongoose, Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

const isEmail = require('validator/lib/isEmail');
const LoginError = require('../errors/LoginError');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new LoginError();
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new LoginError();
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
