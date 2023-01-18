const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const { ERROR_MESSAGE400 } = require('./constants');

module.exports.signupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
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
    image: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) {
        return helpers.message(ERROR_MESSAGE400);
      } return value;
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) {
        return helpers.message(ERROR_MESSAGE400);
      } return value;
    }),
    id: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
});

module.exports.deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    filmId: Joi.string().hex().length(24),
  }),
});

module.exports.patchUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});
