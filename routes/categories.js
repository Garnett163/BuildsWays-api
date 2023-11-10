const router = require('express').Router();
const checkAdmin = require('../middlewares/checkAdmin');

const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require('../controllers/categories');

router.get('/', getCategories);
router.post('/', checkAdmin, createCategory);
router.patch('/:id', checkAdmin, updateCategory);
router.delete('/:id', checkAdmin, deleteCategory);

module.exports = router;
