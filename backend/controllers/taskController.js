const Task = require("../models/Task");

// @desc Get all tasks
// @route GET /api/tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
  res.status(200).json(tasks);
};

// @desc Create task
// @route POST /api/tasks
const createTask = async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    dueDate,
    priority,
    status,
  });

  res.status(201).json(task);
};

// @desc Update task
// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  Object.assign(task, req.body);
  const updated = await task.save();
  res.status(200).json(updated);
};

// @desc Delete task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.status(200).json({ message: "Task deleted" });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
