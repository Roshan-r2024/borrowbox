const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true, lowercase: true, trim: true },
  senderName: { type: String, default: "Student", trim: true },
  text: { type: String, required: true, trim: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "BorrowRequest", required: true, unique: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  buyerEmail: { type: String, required: true, lowercase: true, trim: true },
  buyerName: { type: String, default: "Student" },
  sellerEmail: { type: String, required: true, lowercase: true, trim: true },
  sellerName: { type: String, default: "Student" },
  messages: { type: [messageSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
