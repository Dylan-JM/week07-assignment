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
    const query = db.query(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
      [data.username, data.password]
    );
  } catch (error) {
    console.error(error, "Request failed. User not added");
    res.status(500).json({ request: "fail" });
  }
});
