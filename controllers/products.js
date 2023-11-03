const uuid = require('uuid');
const path = require('path');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const { Product, ProductInfo } = require('../models/models');
const { CREATED_STATUS } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const getProducts = async (req, res, next) => {
  try {
    // eslint-disable-next-line prefer-const
    let { categoryId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    const offset = page * limit - limit;

    const queryOptions = categoryId ? { where: { categoryId }, limit, offset } : { limit, offset };

    const products = await Product.findAndCountAll(queryOptions);
    res.send(products);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name, price, categoryId, info,
    } = req.body;
    const { img } = req.files;
    const fileName = `${uuid.v4()}.jpg`;
    img.mv(path.resolve(__dirname, '..', 'static', fileName));

    const product = await Product.create({
      name, price, categoryId, img: fileName,
    });

    if (info) {
      info.JSON.parse(info);
      info.forEach((i) => ProductInfo.create({
        title: i.title,
        description: i.description,
        productId: product.id,
      }));
    }
    return res.status(CREATED_STATUS).send(product);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(new ConflictError('Товар с таким названием уже существует!'));
    }
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id },
      include: [{ model: ProductInfo, as: 'info' }],
    });

    if (!product) {
      return next(new NotFoundError('Товар с данным id не найден!'));
    }

    return res.send(product);
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
};
