const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const { Category } = require('../models/models');
const { CREATED_STATUS } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

// const getCategories = async (req, res, next) => {
//   try {
//     const categories = await Category.findAll();
//     return res.send(categories);
//   } catch (error) {
//     return next(error);
//   }
// };

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['id', 'ASC']],
    });

    return res.send(categories);
  } catch (error) {
    return next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const imgFile = req.files && req.files.img;
    const maxFileSize = 2097152;

    if (imgFile && imgFile.size > maxFileSize) {
      return next(
        new BadRequestError('Размер файла превышает допустимый предел!'),
      );
    }

    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      return next(
        new ConflictError('Категория с данным названием уже существует!'),
      );
    }

    let fileName = 'default-img.png';

    if (imgFile) {
      fileName = `${uuid.v4()}.jpg`;

      const targetFolder = path.resolve(__dirname, '..', 'images');
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      imgFile.mv(path.resolve(targetFolder, fileName));
    }

    const category = await Category.create({ name, img: fileName });
    return res.status(CREATED_STATUS).send(category);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(
        new ConflictError('Категория с данным названием уже существует!'),
      );
    }
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return next(new NotFoundError('Категория с данным id не найдена!'));
    }

    const imageName = category.img;
    const imagePath = path.resolve(__dirname, '..', 'images', category.img);

    if (imageName !== 'default-img.png' && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await category.destroy();

    return res.send({
      category,
      message: 'Категория и изображение успешно удалены',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные!'));
    }
    return next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  let newImageFileName;

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return next(new NotFoundError('Категория с данным id не найдена!'));
    }

    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ where: { name } });

      if (existingCategory) {
        return next(
          new ConflictError('Категория с данным названием уже существует!'),
        );
      }

      category.name = name;
    }

    if (req.files && req.files.img) {
      const imgFile = req.files.img;
      const maxFileSize = 2097152;

      if (imgFile.size > maxFileSize) {
        return next(
          new BadRequestError('Размер файла превышает допустимый предел!'),
        );
      }

      const imageName = category.img;
      newImageFileName = `${uuid.v4()}.jpg`;

      const targetFolder = path.resolve(__dirname, '..', 'images');
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      const imagePath = path.resolve(__dirname, '..', 'images', category.img);
      if (imageName !== 'default-img.png' && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      imgFile.mv(path.resolve(targetFolder, newImageFileName));
      category.img = newImageFileName;
    }

    await category.save();

    return res.send({
      category,
      message: 'Категория успешно обновлена',
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(
        new ConflictError('Категория с данным названием уже существует!'),
      );
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
  deleteCategory,
  updateCategory,
};
