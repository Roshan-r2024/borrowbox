const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "BorrowRequest", required: true },
  itemTitle: { type: String, default: "Borrow Box order", trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  remindAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.models.Reminder || mongoose.model("Reminder", reminderSchema);
