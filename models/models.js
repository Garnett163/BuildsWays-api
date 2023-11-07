const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../db');
const UnauthorizedError = require('../errors/UnauthorizedError');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

User.findUserByCredentials = async (email, password) => {
  const user = await User.findOne({ where: { email }, attributes: ['id', 'name', 'email', 'role', 'password'] });

  if (!user) {
    return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
  }

  return user;
};

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define('basket_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
});

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  // isFavorite: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Favorite = sequelize.define('favorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const ProductInfo = sequelize.define('product_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.belongsToMany(Product, { through: Favorite });
Product.belongsToMany(User, { through: Favorite });

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

// User.belongsToMany(Product, { through: Basket });
Product.belongsToMany(User, { through: BasketProduct });
BasketProduct.belongsTo(Product, { foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(ProductInfo, { as: 'info' });
ProductInfo.belongsTo(Product);

module.exports = {
  User,
  Basket,
  BasketProduct,
  Product,
  Favorite,
  Category,
  ProductInfo,
};
