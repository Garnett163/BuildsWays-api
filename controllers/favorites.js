const { ValidationError } = require('sequelize');
const { Favorite, User, Product } = require('../models/models');
const { CREATED_STATUS } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const getFavorites = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return next(new NotFoundError('Пользователь с данным id не найден!'));
    }

    const favoriteProducts = await user.getProducts();

    return res.send(favoriteProducts);
  } catch (error) {
    return next(error);
  }
};

const addToFavorites = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const product = await Product.findByPk(req.params.id);

    if (!user || !product) {
      return next(new NotFoundError('Товар с данным id не найден в избранном!'));
    }

    const isProductInFavorites = await Favorite.findOne({
      where: {
        userId: user.id,
        productId: product.id,
      },
    });

    if (isProductInFavorites) {
      return next(new ConflictError('Товар уже добавлен в избранное!'));
    }

    await Favorite.create({
      userId: user.id,
      productId: product.id,
    });

    // await Product.update({ isFavorite: true }, { where: { id: product.id } });

    return res.status(CREATED_STATUS).send({ message: 'Товар успешно добавлен в избранное!' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

const deleteFromFavorites = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const product = await Product.findByPk(req.params.id);

    if (!user || !product) {
      return next(new NotFoundError('Товар с данным id не найден в избранном!'));
    }

    const isProductInFavorites = await Favorite.findOne({
      where: {
        userId: user.id,
        productId: product.id,
      },
    });

    if (!isProductInFavorites) {
      return next(new NotFoundError('Товар с данным id не найден в избранном!'));
    }

    await Favorite.destroy({
      where: {
        userId: user.id,
        productId: product.id,
      },
    });

    // await Product.update({ isFavorite: false }, { where: { id: product.id } });

    return res.send({ message: 'Товар успешно удален из избранного!' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  deleteFromFavorites,
};
