const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const categoriesRouter = require('./categories');
const basketsRouter = require('./baskets');
const productsRouter = require('./products');
const favoritesRouter = require('./favorites');

const { login, logout, register } = require('../controllers/users');

router.use('/signin', login);
router.use('/signup', register);
router.use('/signout', logout);

router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);

router.use(auth);
router.use('/users', userRouter);
router.use('/favorites', favoritesRouter);
router.use('/baskets', basketsRouter);

module.exports = router;
