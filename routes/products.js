const router = require('express').Router();
const checkAdmin = require('../middlewares/checkAdmin');

const {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductById,
} = require('../controllers/products');
const { validateCreateAndUpdateProduct } = require('../middlewares/validation');

router.get('/', getProducts);
router.post('/', validateCreateAndUpdateProduct, checkAdmin, createProduct);
router.patch('/:id', validateCreateAndUpdateProduct, checkAdmin, updateProduct);
router.delete('/:id', checkAdmin, deleteProduct);
router.get('/:id', getProductById);

module.exports = router;
