//imports
import express from "express";
import cors from "cors";
import { db } from "./dbConnection.js";

//init express
const app = express();

//use JSON in our server
app.use(express.json());

//config cors
app.use(cors());

//port
const PORT = 8080;
app.listen(PORT, () => {
  console.info(`Server API is running on port ${PORT}`);
});

//routing system

//root route
//route --> http method GET
// READ data
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server API. GET comfy!" });
});

app.post("/new-user", (req, res) => {
  try {
    const data = req.body;
    db.query(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
      [data.username, data.password]
    );
  } catch (error) {
    console.error(error, "Request failed. User not added");
    res.status(500).json({ request: "fail" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await db.query(
      `SELECT * FROM users WHERE username = $1 AND password = $2`,
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ status: "Invalid username or password" });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ request: "fail" });
  }
});

app.post("/create-post", async (req, res) => {
  try {
    const data = req.body;

    const result = await db.query(
      `INSERT INTO posts (user_id, title, content, category, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.userId, data.title, data.content, data.category, data.image_url]
    );

    res.json({ status: "success", post: result.rows[0] });
  } catch (error) {
    res.status(500).json({ request: "fail" });
  }
});

app.get("/ViewPost/:id", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT posts.*, users.username, users.id AS user_id
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = $1`,
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get("/posts", async (req, res) => {
  const result = await db.query(
    `SELECT posts.*, users.username, users.id AS user_id
     FROM posts
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC`
  );
  res.json(result.rows);
});

app.post("/comments", async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const result = await db.query(
      `INSERT INTO comments (user_id, post_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, postId, content]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get("/comments/:postId", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT comments.*, users.username, users.id AS user_id
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at ASC`,
      [req.params.postId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post("/like-post", async (req, res) => {
  const { postId, userId } = req.body;
  await db.query(
    `INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [postId, userId]
  );
  res.json({ success: true });
});

app.post("/unlike-post", async (req, res) => {
  const { postId, userId } = req.body;
  await db.query(`DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`, [
    postId,
    userId,
  ]);
  res.json({ success: true });
});

app.get("/post-likes/:postId", async (req, res) => {
  const result = await db.query(
    `SELECT COUNT(*) FROM post_likes WHERE post_id = $1`,
    [req.params.postId]
  );
  res.json({ likes: parseInt(result.rows[0].count) });
});

app.get("/post-liked/:postId/:userId", async (req, res) => {
  const result = await db.query(
    `SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2`,
    [req.params.postId, req.params.userId]
  );
  res.json({ liked: result.rows.length > 0 });
});

app.post("/like-comment", async (req, res) => {
  const { commentId, userId } = req.body;
  await db.query(
    `INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [commentId, userId]
  );
  res.json({ success: true });
});

app.post("/unlike-comment", async (req, res) => {
  const { commentId, userId } = req.body;
  await db.query(
    `DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
    [commentId, userId]
  );
  res.json({ success: true });
});

app.get("/comment-likes/:commentId", async (req, res) => {
  const result = await db.query(
    `SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1`,
    [req.params.commentId]
  );
  res.json({ likes: parseInt(result.rows[0].count) });
});

app.get("/comment-liked/:commentId/:userId", async (req, res) => {
  const result = await db.query(
    `SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
    [req.params.commentId, req.params.userId]
  );
  res.json({ liked: result.rows.length > 0 });
});

app.get("/user-posts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

app.get("/user-comments/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      `SELECT comments.*, posts.title AS post_title, posts.id AS post_id
       FROM comments
       JOIN posts ON comments.post_id = posts.id
       WHERE comments.user_id = $1
       ORDER BY comments.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    res.status(500).json({ error: "Failed to fetch user comments" });
  }
});
