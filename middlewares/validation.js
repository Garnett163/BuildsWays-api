const { celebrate, Joi } = require('celebrate');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string()
      .required()
      .email()
      .min(2)
      .max(30),
    password: Joi.string().required().min(2).max(30),
    role: Joi.string(),
  }),
});

const validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string()
      .required()
      .email()
      .min(2)
      .max(30),
  }),
});

const validatelogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .min(2)
      .max(30),
    password: Joi.string().required(),
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
    description: Joi.string().min(2).max(50),
    price: Joi.number().required(),
    categoryId: Joi.number().required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateUpdateUserInfo,
  validatelogin,
  validateCreateAndUpdateCategory,
  validateCreateAndUpdateProduct,
};
