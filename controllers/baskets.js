const { ValidationError } = require('sequelize');
const { Product, Basket, BasketProduct } = require('../models/models');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const getBasket = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const basket = await Basket.findOne({ where: { userId } });

    if (!basket) {
      return next(new NotFoundError('В корзине пока ничего нет!'));
    }

    const basketProducts = await BasketProduct.findAll({
      where: { basketId: basket.id },
      include: Product,
    });

    return res.send(basketProducts);
  } catch (error) {
    return next(error);
  }
};

const addToBasket = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    // let { quantity } = req.body.quantity

    if (!product) {
      return next(new NotFoundError('Товар с данным id не найден!'));
    }

    let basket = await Basket.findOne({ where: { userId } });

    if (!basket) {
      basket = await Basket.create({ userId });
    }

    let basketProduct = await BasketProduct.findOne({ where: { basketId: basket.id, productId } });

    if (!basketProduct) {
      basketProduct = await BasketProduct.create({
        basketId: basket.id,
        productId,
        quantity: 1,
      });
    } else {
      basketProduct.quantity += 1;
      await basketProduct.save();
    }

    return res.send({ basketProduct, message: 'Товар успешно добавлен в корзину!' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

const deleteFromBasket = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const basket = await Basket.findOne({ where: { userId } });

    // eslint-disable-next-line prefer-const
    let basketProduct = await BasketProduct.findOne({ where: { basketId: basket.id, productId } });

    if (!basketProduct) {
      return res.status(404).send({ message: 'Товара с данным id нет в корзине!' });
    }

    if (basketProduct.quantity === 1) {
      await basketProduct.destroy();
    } else {
      basketProduct.quantity -= 1;
      await basketProduct.save();
    }

    return res.status(200).send({ basketProduct, message: 'Товар успешно удален из корзины' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

module.exports = {
  getBasket,
  addToBasket,
  deleteFromBasket,
};
