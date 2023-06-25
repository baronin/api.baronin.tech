const db = require('../db_auth');
const { faker } = require('@faker-js/faker');
const { validationResult } = require('express-validator');
const { checkRequiredFields } = require('../utils/check-required-fields');

class UserController {
  /**
   * Создает нового пользователя.
   * @param {object} req - Объект запроса.
   * @param {object} res - Объект ответа.
   * @returns {Promise<void>} - Промис без значения.
   */
  async createUser(req, res) {
    const { name, email, phone, room, floor, role, isBlocked } = req.body;

    try {
      // Проверка наличия всех обязательных полей
      const requiredFields = ['name', 'email', 'phone', 'room', 'floor'];
      const missingFields = checkRequiredFields(requiredFields, req.body);
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Отсутствуют обязательные поля: ${missingFields.join(', ')}`,
        });
      }

      const newUser = await db.query(
        `INSERT INTO users (name, email, phone, room, floor, role, is_blocked) 
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, email, phone, room, floor, role, isBlocked],
      );
      res.json(newUser.rows[0]);
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  /**
   * Возвращает список всех пользователей.
   * @param {object} req - Объект запроса.
   * @param {object} res - Объект ответа.
   * @returns {Promise<void>} - Промис без значения.
   */
  async getUsers(req, res) {
    try {
      const users = await db.query('SELECT * FROM users');
      res.json(users.rows);
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  /**
   * Возвращает информацию о конкретном пользователе.
   * @param {object} req - Объект запроса.
   * @param {object} res - Объект ответа.
   * @returns {Promise<void>} - Промис без значения.
   */
  async getOneUser(req, res) {
    const id = req.params.id;
    try {
      const user = await db.query('SELECT * FROM users where id = $1', [id]);
      res.json(user.rows[0]);
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  /**
   * Обновляет информацию о пользователе.
   * @param {object} req - Объект запроса.
   * @param {object} res - Объект ответа.
   * @returns {Promise<void>} - Промис без значения.
   */
  async updateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Возвращаем ошибку с информацией о недостающих полях
      const missingFields = errors.array().map((error) => error.param);
      return res
        .status(400)
        .json({ error: 'Отсутствуют обязательные поля', missingFields });
    }

    const { id, name, email, phone, room, floor, role, isBlocked } = req.body;
    try {
      const updatedUser = await db.query(
        'UPDATE users SET name = $1, email = $2, phone = $3, room = $4, floor = $5, role = $6, is_blocked = $7 WHERE id = $8 RETURNING *',
        [name, email, phone, room, floor, role, isBlocked, id],
      );
      if (updatedUser.rows.length === 0) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res
        .status(200)
        .json({ message: 'Данные пользователя успешно обновлены' });
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  /**
   * Удаляет пользователя.
   * @param {object} req - Объект запроса.
   * @param {object} res - Объект ответа.
   * @returns {Promise<void>} - Промис без значения.
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.body;
      await db.query('DELETE FROM users WHERE id = $1', [id]);
      res.status(200).json({ message: 'Пользователь успешно удален' });
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      res
        .status(500)
        .json({ error: 'Ошибка сервера при удалении пользователя' });
    }
  }

  /**
   * Создает фейковых пользователей и добавляет их в базу данных.
   * @param {object} req - Объект запроса.
   * @param {object} res - Объект ответа.
   * @returns {Promise<void>} - Промис без значения.
   */
  async createFakeUsers(req, res) {
    try {
      const COUNT_FAKE_USER = 5;
      const fakeUsers = Array.from({ length: COUNT_FAKE_USER }).map(() => {
        const name = faker.internet.userName();
        const email = faker.internet.email();
        const phone = faker.phone.number('0##-###-##-##');
        const room = faker.string.numeric({ length: { min: 1, max: 2 } });
        const floor = faker.number.int({ min: 1, max: 9 });
        const role = 'user';
        const isBlocked = false;

        return { name, email, phone, room, floor, role, isBlocked };
      });

      for (const user of fakeUsers) {
        try {
          await db.query(
            'INSERT INTO users (name, email, phone, room, floor, role, is_blocked) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [
              user.name,
              user.email,
              user.phone,
              user.room,
              user.floor,
              user.role,
              user.isBlocked,
            ],
          );
        } catch (error) {
          console.error('Ошибка при создании фейкового пользователя:', error);
        }
      }
      res.json(fakeUsers);
    } catch (error) {
      console.error('Ошибка при создании фейковых пользователей:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
}

module.exports = new UserController();
