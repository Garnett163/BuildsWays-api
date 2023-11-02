const router = require('express').Router();

// const { validateUpdateUserInfo } = require('../middlewares/validation');

const {
  getProducts,
  createProduct,
  getProductById,
} = require('../controllers/products');

router.get('/', getProducts);
router.post('/', createProduct);
// router.patch('/', getCurrentUser);
// router.delete('/', getCurrentUser);
router.get('/:id', getProductById);

module.exports = router;
