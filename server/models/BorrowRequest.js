const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    itemTitle: { type: String, required: true, trim: true },
    itemPrice: { type: Number, required: true, min: 0 },
    owner: { type: String, required: true, trim: true },
    ownerEmail: { type: String, required: true, lowercase: true, trim: true },
    borrower: { type: String, required: true, trim: true },
    borrowerEmail: { type: String, required: true, lowercase: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    message: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Returned"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BorrowRequest", borrowRequestSchema);
