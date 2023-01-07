const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const RegisterError = require('../errors/RegisterError');
const BadRequestError = require('../errors/BadRequestError');
const LoginError = require('../errors/LoginError');

const { secretKey } = require('../utils/config');
const { SUCCESS_MESSAGE_LOGIN, SUCCESS_MESSAGE_LOGOUT } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else throw new NotFoundError();
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else throw new NotFoundError();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else if (err.code === 11000) {
        next(new RegisterError());
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.send({ data: user.toJSON() }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new RegisterError());
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : secretKey,
          { expiresIn: '7d' },
        );
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
          .send({ massage: SUCCESS_MESSAGE_LOGIN });
      } else throw new LoginError();
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ massage: SUCCESS_MESSAGE_LOGOUT });
};

/*
module.exports.checkCookie = (req, res) => {
  if (req.cookies.jwt) res.send({ data: true });
  else res.send({ data: false });
};
*/
