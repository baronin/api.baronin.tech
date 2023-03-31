const express = require('express');
const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');

const pg = require('pg');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

app.use('/api', userRouter);
app.use('/api', postRouter);

// Устанавливаем соединение с базой данных
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydatabase',
    password: 'mypassword',
    port: 5432,
});

app.post('/auth/register', (req, res) => {
    const { username, password } = req.body;

    pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        [username, password],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Ошибка сервера');
            } else {
                res.status(201).send('Пользователь зарегистрирован');
            }
        }
    );
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});
