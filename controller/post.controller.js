const db = require('../db');

class PostController {
  async createPost(req, res) {
    const { title, content, userId } = req.body;
    const newPost = await db.query(
      `INSERT INTO post (title, content, user_id) values ($1, $2, $3) RETURNING *`,
      [title, content, userId],
    );
    console.log(title, content);
    res.json(newPost.rows[0]);
  }

  async getPost(req, res) {
    const id = req.query.id;
    const post = await db.query('SELECT * FROM post where user_id = $1', [id]);
    res.json(post.rows[0]);
  }

  async getPosts(req, res) {
    const posts = await db.query('SELECT * FROM post');
    res.json(posts.rows);
  }

  async updatePost(req, res) {
    const { id, title, content } = req.body;
    const post = await db.query(
      'UPDATE post set title = $1, content = $2 where id = $3 RETURNING *',
      [title, content, id],
    );
    res.json(post.rows[0]);
  }

  async deletePost(req, res) {
    const id = req.params.id;
    const user = await db.query('DELETE FROM post where id = $1', [id]);
    res.json(user.rows[0]);
  }
}

module.exports = new PostController();
