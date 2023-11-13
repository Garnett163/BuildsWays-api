const router = require('express').Router();
const checkAdmin = require('../middlewares/checkAdmin');

const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require('../controllers/categories');
const { validateCreateAndUpdateCategory } = require('../middlewares/validation');

router.get('/', getCategories);
router.post('/', validateCreateAndUpdateCategory, checkAdmin, createCategory);
router.patch('/:id', validateCreateAndUpdateCategory, checkAdmin, updateCategory);
router.delete('/:id', checkAdmin, deleteCategory);

module.exports = router;
