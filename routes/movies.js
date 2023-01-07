const router = require('express').Router();

const { postMovieValidator, deleteMovieValidator } = require('../utils/validation');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', postMovieValidator, createMovie);

router.delete('/:filmId', deleteMovieValidator, deleteMovie);

module.exports = router;
