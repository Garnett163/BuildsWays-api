const router = require('express').Router();

// const { validateUpdateUserInfo } = require('../middlewares/validation');

const {
  getCurrentUser,
  updateUserInfo,
} = require('../controllers/users');

router.get('/user', getCurrentUser);
router.patch('/user', updateUserInfo);

module.exports = router;
