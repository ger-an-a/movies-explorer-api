const router = require('express').Router();

const {
  createUser, login, logout, // checkCookie,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { signupValidator, signinValidator } = require('../utils/validation');

const notFound = () => {
  throw new NotFoundError();
};

router.post('/signup', signupValidator, createUser);

router.post('/signin', signinValidator, login);

router.post('/signout', logout);
//  router.get('/checkCookie', checkCookie);

router.use(auth);

router.use('/users', require('./users'));

router.use('/movies', require('./movies'));

router.use(notFound);

module.exports = router;
