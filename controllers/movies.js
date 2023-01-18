const Movie = require('../models/movie');
const AccessError = require('../errors/AccessError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const SUCCESS_MESSAGE_DELETE = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, id,
  } = req.body;
  Movie.create({
    owner: req.user._id,
    movieId: id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.filmId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError();
      } else {
        if (movie.owner.toString() !== req.user._id) {
          throw new AccessError();
        }
        return movie.remove()
          .then(() => res.send({ message: SUCCESS_MESSAGE_DELETE }));
      }
    })
    .catch(next);
};
