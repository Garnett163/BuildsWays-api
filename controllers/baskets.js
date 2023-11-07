const {
  User, Product, Basket, BasketProduct,
} = require('../models/models');

const getBasket = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const basket = await Basket.findOne({ where: { userId } });

    if (!basket) {
      return res.status(404).send({ message: 'Корзина не найдена' });
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

// Добавление товара в корзину пользователя
const addToBasket = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    let basketProduct = await BasketProduct.findOne({ where: { userId, productId } });

    if (!basketProduct) {
      basketProduct = await BasketProduct.create({
        userId,
        productId,
        quantity: 1,
      });
    } else {
      basketProduct.quantity += 1;
      await basketProduct.save();
    }

    return res.status(201).send(basketProduct);
  } catch (error) {
    return next(error);
  }
};

// Удаление товара из корзины пользователя
const deleteFromBasket = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const product = await Product.findByPk(req.params.id);

    if (!user || !product) {
      return res.status(404).send({ message: 'Пользователь или продукт не найдены' });
    }

    // Удаляем товар из корзины пользователя
    await user.removeProduct(product);

    return res.send({ message: 'Продукт успешно удален из корзины' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getBasket,
  addToBasket,
  deleteFromBasket,
};
