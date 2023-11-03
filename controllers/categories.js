const { UniqueConstraintError, ValidationError } = require('sequelize');
const { Category } = require('../models/models');
const { CREATED_STATUS } = require('../utils/constants');
// const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    return res.send(categories);
  } catch (error) {
    return next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await Category.create({ name });
    return res.status(CREATED_STATUS).send(category);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(new ConflictError('Категория с данным названием уже существует!'));
    }
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
};
