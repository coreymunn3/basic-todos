const express = require("express");
const db = require("./db");
const Todo = require("./models/todo");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
  res.status(200).send({ message: "test" });
});

// Routes
// get all todos
app.get("/api/todo", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to GET todos", error });
  }
});

// get single todo
app.get("/api/todo/:id", async (req, res) => {
  const todoId = req.params.id;
  try {
    const todo = await Todo.findByPk(todoId);
    res.status(200).json(todo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `unable to get todo ${todoId}`, error });
  }
});

// create a todo
app.post("/api/todo", async (req, res) => {
  const { title, completed } = req.body;
  if (!title || completed === undefined) {
    res.status(400).json({
      status: "error",
      message: "bad request, missing title or completed",
    });
  }
  try {
    const createdTodo = await Todo.create({
      title,
      completed,
    });
    res
      .status(201)
      .json({ status: "success", message: "created todo successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "unable to create todo" });
  }
});

// update a todo
app.put("/api/todo/:id", async (req, res) => {
  const { title, completed } = req.body;
  console.log(req.body);
  const todoId = req.params.id;
  if (!title && completed === undefined) {
    res.status(400).json({
      status: "error",
      message: "bad request, missing title or completed",
    });
  }
  // find the todo then update
  try {
    const todo = await Todo.findByPk(todoId);
    // if the field was passed into the body, update it
    if (title) {
      await todo.update({ title });
    }
    if (completed !== undefined) {
      await todo.update({ completed });
    }
    await todo.save();
    res.status(200).json({
      status: "success",
      message: `updated todo ${todoId}`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "error", message: `todo ${todoId} not found` });
  }
});

// delete a todo
app.delete("/api/todo/:id", async (req, res) => {
  const todoId = req.params.id;
  try {
    const todo = await Todo.findByPk(todoId);
    await todo.destroy();
    res.status(200).json({
      status: "success",
      message: `successfully deleted todo ${todoId}`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
      message: `todo ${todoId} not found`,
    });
  }
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});

db.sync()
  .then((result) => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
