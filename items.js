const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Item = require("../models/Item");
const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  cb(null, allowedTypes.includes(file.mimetype));
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

router.post("/", (req, res) => {
  upload.single("image")(req, res, async (uploadError) => {
    if (uploadError) return res.status(400).json({ message: uploadError.message || "Image upload failed." });
    try {
      if (!req.file) return res.status(400).json({ message: "Please upload an item image." });
      const { title, category, listingType, price, description, condition, availability, displayStyle, owner, ownerEmail } = req.body;
      if (!title || !category || !price || !description || !condition || !availability) {
        return res.status(400).json({ message: "All item details are required." });
      }
      const item = await Item.create({
        title: title.trim(), category, listingType: listingType === "sale" ? "sale" : "rent",
        price: Number(price), description: description.trim(), condition, availability,
        owner: owner || "Student", ownerEmail: ownerEmail || "", imageUrl: `/uploads/${req.file.filename}`,
        displayStyle: displayStyle || "square", status: "Available",
      });
      return res.status(201).json({ message: "Item listed successfully.", item });
    } catch (error) {
      console.error("CREATE ITEM ERROR:", error);
      return res.status(500).json({ message: "Unable to list item." });
    }
  });
});

router.get("/", async (req, res) => {
  try {
    const items = await Item.find({ ownerEmail: { $exists: true, $nin: [null, ""] } }).sort({ createdAt: -1 });
    return res.status(200).json({ items });
  } catch (error) {
    console.error("GET ITEMS ERROR:", error);
    return res.status(500).json({ message: "Unable to load items." });
  }
});

module.exports = router;
