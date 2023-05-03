require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// middleware
app.use(cors());
app.use(express.json()); // allows us to add req.body

//ROUTES - ENDPOINTS

// get all todos
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  // console.log(userEmail);

  try {
    const allTodos = await pool.query(
      "SELECT * FROM todos WHERE user_email = $1",
      [userEmail]
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todos WHERE todo_id = $1", [
      id,
    ]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//create new todo
app.post("/todos", async (req, res) => {
  try {
    const { user_email, title } = req.body;
    const id = uuidv4();
    const newTodo = await pool.query(
      "INSERT INTO todos (id, user_email, title) VALUES($1, $2, $3) RETURNING *",
      [id, user_email, title]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//update a todo
app.patch("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todos SET title = $1 WHERE id = $2;",
      [title, id]
    );

    res.json("todo was updated");
  } catch (err) {
    console.log(err.message);
  }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todos WHERE id = $1", [
      id,
    ]);
    res.json("todo was deleted");
  } catch (err) {
    console.log(err.message);
  }
});

//sign up
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const signUp = await pool.query(
      `INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
      [email, hashedPassword]
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    res.json({ email, token });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!users.rows.length) return res.json({ detail: "User does not exist!" });

    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    if (success) {
      res.json({ email: users.rows[0].email, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(5000, () => {
  console.log("server running on poort 5000");
});
