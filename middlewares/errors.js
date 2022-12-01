const { ERROR_CODE500, ERROR_MESSAGE500 } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || ERROR_CODE500;
  const message = statusCode === ERROR_CODE500 ? ERROR_MESSAGE500 : err.message;
  res.status(statusCode).send({ message });
  next();
};
