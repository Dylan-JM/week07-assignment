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
      `SELECT posts.*, users.username 
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
    `SELECT posts.*, users.username
     FROM posts
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC`
  );
  res.json(result.rows);
});
