const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔹 speeds up queries like: find({ user: ... })
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" }, // 🔹 default empty string for drafts
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Note", noteSchema);
