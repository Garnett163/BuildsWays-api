const { Category } = require('../models/models');
const { CREATED_STATUS } = require('../utils/constants');
// const NotFoundError = require('../errors/NotFoundError');
// const BadRequestError = require('../errors/BadRequestError');
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
    const сonflictError = await Category.findOne({ where: { name } });
    if (сonflictError) {
      return next(new ConflictError('Категория с данными названием уже существует!'));
    }
    const category = await Category.create({ name });
    return res.status(CREATED_STATUS).send(category);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
};
