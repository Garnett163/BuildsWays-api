const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const { Product, ProductInfo } = require('../models/models');
const { CREATED_STATUS } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const getProducts = async (req, res, next) => {
  // eslint-disable-next-line prefer-const
  let { categoryId, limit, page } = req.query;
  try {
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
  const {
    name, price, categoryId, info,
  } = req.body;
  let fileName = 'default-img-product.png';
  try {
    if (req.files && req.files.img) {
      fileName = `${uuid.v4()}.jpg`;
      req.files.img.mv(path.resolve(__dirname, '..', 'images', fileName));
    }

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

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return next(new NotFoundError('Товар с данным id не найден!'));
    }

    const imagePath = path.resolve(__dirname, '..', 'images', product.img);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await product.destroy();

    return res.send({
      product,
      message: 'Продукт и изображение успешно удалены',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Произошла ошибка валидации данных!'));
    }
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const {
    name, price, categoryId, info,
  } = req.body;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return next(new NotFoundError('Продукт не найден'));
    }

    if (name) {
      product.name = name;
    }
    if (price) {
      product.price = price;
    }
    if (categoryId) {
      product.categoryId = categoryId;
    }

    const oldImgPath = product.img;

    if (req.files && req.files.img) {
      const newImgFileName = `${uuid.v4()}.jpg`;

      if (oldImgPath) {
        const oldImgFullPath = path.resolve(__dirname, '..', 'images', oldImgPath);
        fs.unlinkSync(oldImgFullPath);
      }

      req.files.img.mv(path.resolve(__dirname, '..', 'images', newImgFileName));
      product.img = newImgFileName;
    }

    await product.save();

    if (info) {
      const productInfo = JSON.parse(info);
      await ProductInfo.destroy({ where: { productId } });

      productInfo.forEach((i) => ProductInfo.create({
        title: i.title,
        description: i.description,
        productId,
      }));
    }

    return res.send(product);
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
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
  deleteProduct,
  updateProduct,
  getProductById,
};
