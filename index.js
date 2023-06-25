const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

app.use(express.json());

// Создание пользователя
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES ($1, $2)';
  try {
    await pool.query(query, [name, email]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Получение списка пользователей
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
