// controllers/notesController.js
const Note = require("../models/Note");

// =======================
// Create Note
// =======================
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
    });

    return res.status(201).json({
      success: true,
      data: note.toObject(),
      message: "Note created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// =======================
// Get All Notes
// =======================
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: notes,
      message: "Notes fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};

// =======================
// Get Single Note
// =======================
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();

    if (!note) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Note not found",
      });
    }

    return res.json({
      success: true,
      data: note,
      message: "Note fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// =======================
// Update Note
// =======================
exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content },
      { new: true, lean: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Note not found",
      });
    }

    return res.json({
      success: true,
      data: note,
      message: "Note updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// =======================
// Delete Note
// =======================
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    }).lean();

    if (!note) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Note not found",
      });
    }

    return res.json({
      success: true,
      data: { id: req.params.id },
      message: "Note deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};
