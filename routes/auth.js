const router = require('express').Router();

const { login, logout, register } = require('../controllers/users');
const {
  validateCreateUser,
  validatelogin,
} = require('../middlewares/validation');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Аутентификация и управление сеансами пользователей
 */

/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: Вход пользователя
 *     description: Аутентификация пользователя и создание сеанса
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: example@example.com
 *             password: userpassword
 *     responses:
 *       200:
 *         description: Успешная аутентификация
 *         content:
 *           application/json:
 *             example:
 *               token: generatedjsonwebtoken
 *               message: Аутентификация прошла успешно
 *       401:
 *         description: Неверные учетные данные
 *         content:
 *           application/json:
 *             example:
 *               message: Неверные учетные данные
 */
router.post('/signin', validatelogin, login);

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Создание нового аккаунта пользователя
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: newuser@example.com
 *             password: userpassword
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             example:
 *               message: Регистрация прошла успешно
 */
router.post('/signup', validateCreateUser, register);

/**
 * @swagger
 * /api/signout:
 *   post:
 *     summary: Выход пользователя
 *     description: Завершение сеанса пользователя
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Успешный выход
 *         content:
 *           application/json:
 *             example:
 *               message: Пользователь успешно вышел из системы
 */
router.post('/signout', logout);

module.exports = router;
