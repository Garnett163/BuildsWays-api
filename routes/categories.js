const router = require('express').Router();
const checkAdmin = require('../middlewares/checkAdmin');
const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require('../controllers/categories');
const { validateCreateAndUpdateCategory } = require('../middlewares/validation');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Маршруты для работы с категориями
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Получить список категорий
 *     description: Получение списка всех категорий
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             example:
 *               message: Список категорий получен успешно
 */
router.get('/', getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Создать новую категорию
 *     description: Создание новой категории (требуется администратор)
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Новая категория
 *     responses:
 *       201:
 *         description: Успешное создание категории
 *         content:
 *           application/json:
 *             example:
 *               message: Категория успешно создана
 *       403:
 *         description: Доступ запрещен
 *         content:
 *           application/json:
 *             example:
 *               message: Доступ запрещен. Требуется администратор.
 */
router.post('/', validateCreateAndUpdateCategory, checkAdmin, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Обновить существующую категорию
 *     description: Обновление данных существующей категории
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор категории
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Обновленная категория
 *     responses:
 *       200:
 *         description: Успешное обновление категории
 *         content:
 *           application/json:
 *             example:
 *               message: Категория успешно обновлена
 */
router.patch('/:id', validateCreateAndUpdateCategory, checkAdmin, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Удалить существующую категорию
 *     description: Удаление существующей категории
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор категории
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успешное удаление категории
 *         content:
 *           application/json:
 *             example:
 *               message: Категория успешно удалена
 */
router.delete('/:id', checkAdmin, deleteCategory);

module.exports = router;
