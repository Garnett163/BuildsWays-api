const { celebrate, Joi } = require('celebrate');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().min(5)
      .max(30),
    password: Joi.string().required().min(3).max(30),
    role: Joi.string(),
  }),
});

const validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().min(5)
      .max(30),
  }),
});

const validatelogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(5)
      .max(30),
    password: Joi.string().required().min(3).max(30),
  }),
});

const validateCreateAndUpdateCategory = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(50),
  }),
});

const validateCreateAndUpdateProduct = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(50),
    description: Joi.string().min(2).max(1200),
    price: Joi.number().required(),
    categoryId: Joi.number().required(),
    parameters: Joi.string(),
  }),
});

module.exports = {
  validateCreateUser,
  validateUpdateUserInfo,
  validatelogin,
  validateCreateAndUpdateCategory,
  validateCreateAndUpdateProduct,
};
