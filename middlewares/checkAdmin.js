const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports = (req, res, next) => {
  if (!req.cookies) {
    return next(new UnauthorizedError('Необходима авторизация!'));
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'ADMIN') {
      return next(new ForbiddenError('Отказано в доступе!'));
    }
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация!'));
  }

  req.user = payload;

  return next();
};
