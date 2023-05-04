require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");

// Authentication packages
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// middleware
app.use(cors());
app.use(express.json()); // allows us to add req.body when we send data to server (post)

// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

// ROUTING //////////////////////////////////////////////////////////////////////////////
// ROUTE STRUCTURE: app.method(PATH, HANDLER)

app
  .route("/todos")
  .post(async (req, res) => {
    try {
      const { title, user_email } = req.body;
      const id = uuidv4();
      const newTodo = await pool.query(
        "INSERT INTO todos (id, user_email, title) VALUES($1, $2, $3) RETURNING *",
        [id, user_email, title]
      );

      res
        .set({
          "Content-Type": "application/json",
          "X-Custom-Header": "Hello there!",
        })
        .status(202)
        .json(newTodo.rows[0]);
    } catch (err) {
      console.log(err.message);
    }
  })

  .get(async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM todos");
      res.json(allTodos.rows);
    } catch (err) {
      console.log(err.message);
    }
  });

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

app
  .route("/todos/:id")
  .patch(async (req, res) => {
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
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      const deleteTodo = await pool.query("DELETE FROM todos WHERE id = $1", [
        id,
      ]);
      res.json("todo was deleted");
    } catch (err) {
      console.log(err.message);
    }
  })
  .get(async (req, res) => {
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

// ROUTING END ///////////////////////////////////////////////////////////////////////////

app.listen(5000, () => {
  console.log("Server running on port 5K");
});
