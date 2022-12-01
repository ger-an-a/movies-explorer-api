const { celebrate, Joi } = require('celebrate');

const { regexUrl, regexRU, regexEN } = require('./constants');

module.exports.signupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.postMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(new RegExp(regexUrl)),
    trailerLink: Joi.string().required().pattern(new RegExp(regexUrl)),
    thumbnail: Joi.string().required().pattern(new RegExp(regexUrl)),
    movieId: Joi.string().hex().length(24),
    nameRU: Joi.string().required().pattern(new RegExp(regexRU)),
    nameEN: Joi.string().required().pattern(new RegExp(regexEN)),
  }),
});

module.exports.deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports.patchUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});
