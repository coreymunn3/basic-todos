const router = require("express").Router();
const Todo = require("../models/todo");

// CRUD todo routes

// get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to GET todos", error });
  }
});

// get single todo
router.get("/:id", async (req, res) => {
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
router.post("/", async (req, res) => {
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
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

module.exports = router;
