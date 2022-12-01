const router = require('express').Router();

const { getUser, updateUser } = require('../controllers/users');
const { patchUserValidator } = require('../utils/validation');

router.get('/me', getUser);

router.patch('/me', patchUserValidator, updateUser);

module.exports = router;
