const router = require('express').Router();

const {
  getCurrentUser,
  updateUserInfo,
} = require('../controllers/users');
const { validateUpdateUserInfo } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validateUpdateUserInfo, updateUserInfo);

module.exports = router;
