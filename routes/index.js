const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const categoriesRouter = require('./categories');
const basketsRouter = require('./baskets');
const productsRouter = require('./products');
const favoritesRouter = require('./favorites');
const NotFoundError = require('../errors/NotFoundError');

const { login, logout, register } = require('../controllers/users');
const {
  validateCreateUser,
  validatelogin,
} = require('../middlewares/validation');

router.use('/signin', validatelogin, login);
router.use('/signup', validateCreateUser, register);
router.use('/signout', logout);

router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);

router.use(auth);
router.use('/users', userRouter);
router.use('/favorites', favoritesRouter);
router.use('/baskets', basketsRouter);

router.use((req, res, next) => next(new NotFoundError('Данные не найдены!')));

module.exports = router;
