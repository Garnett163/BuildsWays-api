const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const categoriesRouter = require('./categories');
// const basketsRouter = require('./baskets');
const productsRouter = require('./products');
const favoritesRouter = require('./favorites');

const { login, createUser, logout } = require('../controllers/users');

router.use('/signin', login);
router.use('/signup', createUser);
router.use('/signout', logout);

router.use('/categories', categoriesRouter);
// router.use('/baskets', basketsRouter);
router.use('/products', productsRouter);

router.use(auth);
router.use('/users', userRouter);
router.use('/favorites', favoritesRouter);

module.exports = router;
