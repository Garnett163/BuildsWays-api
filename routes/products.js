const router = require('express').Router();
const checkAdmin = require('../middlewares/checkAdmin');

const {
  getProducts,
  createProduct,
  deleteProduct,
  getProductById,
} = require('../controllers/products');

router.get('/', getProducts);
router.post('/', checkAdmin, createProduct);
// router.patch('/', checkAdmin, getCurrentUser);
router.delete('/:id', checkAdmin, deleteProduct);
router.get('/:id', getProductById);

module.exports = router;
