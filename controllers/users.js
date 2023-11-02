const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const Models = require('../models/models');
const { CREATED_STATUS } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
// const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const getCurrentUser = (req, res, next) => {
  Models.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному id не найден!'))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  Models.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с указанным id не найден!'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует!'));
      }
      // if (err instanceof ValidationError) {
      //   return next(new BadRequestError('Переданы некорректные данные при обновлении профиля!'));
      // }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => Models.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(CREATED_STATUS).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован!'));
      }
      // if (err instanceof ValidationError) {
      //   return next(new BadRequestError('Переданы некорректные данные!'));
      // }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return Models.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true, maxAge: 604800000, sameSite: true });
      res.send({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        message: 'Авторизация прошла успешно!',
      });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'Вы успешно вышли из аккаунта!' });
};

module.exports = {
  getCurrentUser,
  createUser,
  updateUserInfo,
  login,
  logout,
};
