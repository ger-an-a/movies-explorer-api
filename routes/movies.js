const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { regexUrl, regexRU, regexEN } = require('../utils/constants');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
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
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
