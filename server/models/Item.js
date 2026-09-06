const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    listingType: {
      type: String,
      enum: ["rent", "sale"],
      default: "rent",
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    condition: { type: String, required: true },
    availability: { type: String, required: true },
    owner: { type: String, required: true },
    ownerEmail: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    displayStyle: {
      type: String,
      enum: ["square", "portrait", "landscape"],
      default: "square",
    },
    status: {
      type: String,
      enum: ["Available", "Borrowed", "Sold", "Unavailable"],
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
