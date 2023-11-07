const router = require('express').Router();

// const { validateUpdateUserInfo } = require('../middlewares/validation');

const {
  getBasket,
  addToBasket,
  deleteFromBasket,
} = require('../controllers/baskets');

router.get('/', getBasket);
router.post('/:id', addToBasket);
router.delete('/:id', deleteFromBasket);

module.exports = router;
