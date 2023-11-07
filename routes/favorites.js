const router = require('express').Router();

// const { validateUpdateUserInfo } = require('../middlewares/validation');

const {
  getFavorites,
  addToFavorites,
  deleteFromFavorites,
} = require('../controllers/favorites');

router.get('/', getFavorites);
router.post('/:id', addToFavorites);
router.delete('/:id', deleteFromFavorites);

module.exports = router;
