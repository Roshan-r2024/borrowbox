const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    itemTitle: {
      type: String,
      required: true,
    },

    borrower: {
      type: String,
      required: true,
    },

    borrowerEmail: {
      type: String,
      required: true,
    },

    owner: {
      type: String,
      required: true,
    },

    ownerEmail: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "BorrowRequest",
    borrowRequestSchema
  );