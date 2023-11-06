const router = require('express').Router();

// const { validateUpdateUserInfo } = require('../middlewares/validation');

const {
  getProducts,
  createProduct,
  deleteProduct,
  getProductById,
} = require('../controllers/products');

router.get('/', getProducts);
router.post('/', createProduct);
// router.patch('/', getCurrentUser);
router.delete('/:id', deleteProduct);
router.get('/:id', getProductById);

module.exports = router;
