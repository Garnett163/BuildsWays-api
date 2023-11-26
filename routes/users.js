const router = require('express').Router();

const {
  getCurrentUser,
  updateUserInfo,
} = require('../controllers/users');
const { validateUpdateUserInfo } = require('../middlewares/validation');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для работы с пользователями
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Получение информации о текущем пользователе
 *     description: Получение информации о текущем авторизованном пользователе
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное получение информации о пользователе
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: Имя пользователя
 *               email: example@example.com
 *               role: USER
 *       404:
 *         description: Пользователь с указанным id не найден
 *         content:
 *           application/json:
 *             example:
 *               message: Пользователь с таким id не найден!
 */

router.get('/me', getCurrentUser);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Обновление информации о текущем пользователе
 *     description: Обновление информации о текущем авторизованном пользователе
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Новое имя пользователя
 *             email: new@example.com
 *     responses:
 *       200:
 *         description: Успешное обновление информации о пользователе
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: Новое имя пользователя
 *               email: new@example.com
 *       404:
 *         description: Пользователь с указанным id не найден
 *         content:
 *           application/json:
 *             example:
 *               message: Пользователь с таким id не найден!
 *       409:
 *         description: Конфликт - пользователь с таким email уже существует
 *         content:
 *           application/json:
 *             example:
 *               message: Пользователь с таким email уже существует!
 *       400:
 *         description: Некорректные данные запроса
 *         content:
 *           application/json:
 *             example:
 *               message: Переданы некорректные данные!
 */
router.patch('/me', validateUpdateUserInfo, updateUserInfo);

module.exports = router;
