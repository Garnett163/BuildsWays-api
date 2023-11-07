// const { UniqueConstraintError, ValidationError } = require('sequelize');
const { Favorite, User, Product } = require('../models/models');
// const { CREATED_STATUS, NOT_FOUND } = require('../utils/constants');
// const NotFoundError = require('../errors/NotFoundError');
// const BadRequestError = require('../errors/BadRequestError');
// const ConflictError = require('../errors/ConflictError');

const getFavorites = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
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
      return res.status(404).send({ message: 'Пользователь или продукт не найдены' });
    }

    const isProductInFavorites = await Favorite.findOne({
      where: {
        userId: user.id,
        productId: product.id,
      },
    });

    if (isProductInFavorites) {
      return res.status(409).send({ message: 'Товар уже добавлен в избранное' });
    }

    await Favorite.create({
      userId: user.id,
      productId: product.id,
    });

    // await Product.update({ isFavorite: true }, { where: { id: product.id } });

    return res.send({ message: 'Продукт успешно добавлен в избранное' });
  } catch (error) {
    return next(error);
  }
};

const deleteFromFavorites = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const product = await Product.findByPk(req.params.id);

    if (!user || !product) {
      return res.status(404).send({ message: 'Пользователь или продукт не найдены' });
    }

    const isProductInFavorites = await Favorite.findOne({
      where: {
        userId: user.id,
        productId: product.id,
      },
    });

    if (!isProductInFavorites) {
      return res.status(404).send({ message: 'Товар не найден в избранном' });
    }

    await Favorite.destroy({
      where: {
        userId: user.id,
        productId: product.id,
      },
    });

    // await Product.update({ isFavorite: false }, { where: { id: product.id } });

    return res.send({ message: 'Продукт успешно удален из избранного' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  deleteFromFavorites,
};
