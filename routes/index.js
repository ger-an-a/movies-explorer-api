const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createUser, login, logout, // checkCookie,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

const notFound = () => {
  throw new NotFoundError();
};

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signout', logout);
//  router.get('/checkCookie', checkCookie);

router.use(auth);

router.use('/users', require('./users'));

router.use('/movies', require('./movies'));

router.use(notFound);

module.exports = router;
