const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SequelizeEmptyResultError, UniqueConstraintError, ValidationError } = require('sequelize');
const { JWT_SECRET } = require('../utils/config');
const { User } = require('../models/models');
const { CREATED_STATUS } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const register = async (req, res, next) => {
  const {
    name, email, password, role,
  } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, role, password: hashPassword,
    });
    // const basket = await Basket.create({ userId: user.id });

    return res.status(CREATED_STATUS).send({
      id: user.id, name: user.name, email: user.email, role: user.role,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(new ConflictError('Пользователь с таким email уже существует!'));
    }
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 604800000, sameSite: true });
    res.send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Авторизация прошла успешно!',
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await User.findByPk(id);

    // if (!user) {
    //   throw new NotFoundError('Пользователь по указанному id не найден!');
    // }

    return res.send({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof SequelizeEmptyResultError) {
      return next(new NotFoundError('Пользователь с таким id не найден!'));
    }
    return next(error);
  }
};

const updateUserInfo = async (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  try {
    const [rowsAffected, [updatedUser]] = await User.update({ name, email }, {
      where: { id: userId },
      returning: true,
    });

    if (rowsAffected === 0) {
      throw new NotFoundError('Пользователь с указанным id не найден!');
    }

    return res.send({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    // if (error instanceof SequelizeEmptyResultError) {
    //   return next(new NotFoundError('Пользователь с таким id не найден!'));
    // }
    if (error instanceof UniqueConstraintError) {
      return next(new ConflictError('Пользователь с таким email уже существует!'));
    }
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }

    return next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'Вы успешно вышли из аккаунта!' });
};

module.exports = {
  getCurrentUser,
  register,
  updateUserInfo,
  login,
  logout,
};
