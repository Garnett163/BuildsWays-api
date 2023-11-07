const router = require('express').Router();
const checkAdmin = require('../middlewares/checkAdmin');

const {
  getCategories,
  createCategory,
} = require('../controllers/categories');

router.get('/', getCategories);
router.post('/', checkAdmin, createCategory);
// router.patch('/', getCurrentUser);
// router.delete('/', getCurrentUser);

module.exports = router;
