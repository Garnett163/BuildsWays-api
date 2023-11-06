const router = require('express').Router();

// const { validateUpdateUserInfo } = require('../middlewares/validation');

const {
  getFavorites,
  addToFavorites,
} = require('../controllers/favorites');

router.get('/', getFavorites);
router.post('/:id', addToFavorites);
// router.delete('/', getCurrentUser);

module.exports = router;
