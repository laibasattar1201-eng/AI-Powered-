const Note = require("../models/Note");

// @desc Get all notes of logged-in user
// @route GET /api/notes
const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(notes);
};

// @desc Create a note
// @route POST /api/notes
const createNote = async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    tags,
  });

  res.status(201).json(note);
};

// @desc Get single note
// @route GET /api/notes/:id
const getNoteById = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.status(200).json(note);
};

// @desc Update a note
// @route PUT /api/notes/:id
const updateNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: "Note not found" });

  note.title = req.body.title ?? note.title;
  note.content = req.body.content ?? note.content;
  note.tags = req.body.tags ?? note.tags;

  const updated = await note.save();
  res.status(200).json(updated);
};

// @desc Delete a note
// @route DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.status(200).json({ message: "Note deleted" });
};

module.exports = { getNotes, createNote, getNoteById, updateNote, deleteNote };
