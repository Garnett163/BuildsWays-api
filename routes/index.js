const router = require('express').Router();
const auth = require('../middlewares/auth');
const authRouter = require('./auth');
const userRouter = require('./users');
const categoriesRouter = require('./categories');
const basketsRouter = require('./baskets');
const productsRouter = require('./products');
const favoritesRouter = require('./favorites');
const NotFoundError = require('../errors/NotFoundError');

router.use('/', authRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);

router.use(auth);
router.use('/users', userRouter);
router.use('/favorites', favoritesRouter);
router.use('/baskets', basketsRouter);

router.use((req, res, next) => next(new NotFoundError('Данные не найдены!')));

module.exports = router;
