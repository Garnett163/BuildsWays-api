const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { User } = require('../models/models');
const { CREATED_STATUS } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
// const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const register = async (req, res, next) => {
  const {
    name, email, password, role,
  } = req.body;

  try {
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      return next(new ConflictError('Пользователь с таким email уже существует!'));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, role, password: hashPassword,
    });
    // const basket = await Basket.create({ userId: user.id });

    return res.status(CREATED_STATUS).send({
      id: user.id, name: user.name, email: user.email, role: user.role,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
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

    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден!');
    }

    res.send({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// const updateUserInfo = (req, res, next) => {
//   const { name, email } = req.body;
//   Models.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
//     .orFail(new NotFoundError('Пользователь с указанным id не найден!'))
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.code === 11000) {
//         return next(new ConflictError('Пользователь с таким email уже существует!'));
//       }
//       // if (err instanceof ValidationError) {
//       //return next(new BadRequestError('Переданы некорректные данные при обновлении профиля!'));
//       // }
//       return next(err);
//     });
// };

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'Вы успешно вышли из аккаунта!' });
};

module.exports = {
  getCurrentUser,
  register,
  // updateUserInfo,
  login,
  logout,
};
