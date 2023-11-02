const router = require('express').Router();

// const { validateUpdateUserInfo } = require('../middlewares/validation');

const {
  getCategories,
  createCategory,
} = require('../controllers/categories');

router.get('/', getCategories);
router.post('/', createCategory);
// router.patch('/', getCurrentUser);
// router.delete('/', getCurrentUser);

module.exports = router;
