const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    itemTitle: { type: String, required: true },
    itemPrice: { type: Number, default: 0 },
    requestType: { type: String, enum: ["Borrow", "Purchase"], default: "Borrow" },
    borrower: { type: String, required: true },
    borrowerEmail: { type: String, required: true, lowercase: true, trim: true },
    owner: { type: String, required: true },
    ownerEmail: { type: String, default: "", lowercase: true, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    message: { type: String, default: "", trim: true },
    urgency: { type: String, enum: ["Normal", "Urgent"], default: "Normal" },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Returned"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BorrowRequest", borrowRequestSchema);
