const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Item = require("../models/Item");
const User = require("../models/User");

const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    cb(allowed.includes(file.mimetype) ? null : new Error("Only JPG, JPEG and PNG images are allowed."), allowed.includes(file.mimetype));
  },
});

async function addOwnerPhone(item) {
  const plainItem = item?.toObject ? item.toObject() : item;
  if (!plainItem?.ownerEmail) return { ...plainItem, ownerPhone: "" };
  const user = await User.findOne({ email: String(plainItem.ownerEmail).toLowerCase() }).select("phone").lean();
  return { ...plainItem, ownerPhone: user?.phone || "" };
}

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
        title: title.trim(), category, listingType: listingType === "sale" ? "sale" : "rent", price: Number(price),
        description: description.trim(), condition, availability, owner: owner || "Student", ownerEmail: ownerEmail || "",
        imageUrl: `/uploads/${req.file.filename}`, displayStyle: displayStyle || "square", status: "Available",
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
    const items = await Item.find().sort({ createdAt: -1 }).lean();
    const emails = [...new Set(items.map(i => String(i.ownerEmail || "").toLowerCase()).filter(Boolean))];
    const users = emails.length ? await User.find({ email: { $in: emails } }).select("email phone").lean() : [];
    const phoneByEmail = new Map(users.map(u => [String(u.email).toLowerCase(), u.phone || ""]));
    return res.status(200).json({ items: items.map(item => ({ ...item, ownerPhone: phoneByEmail.get(String(item.ownerEmail || "").toLowerCase()) || "" })) });
  } catch (error) {
    console.error("GET ITEMS ERROR:", error);
    return res.status(500).json({ message: "Unable to load items." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Item not found." });
    return res.status(200).json({ item: await addOwnerPhone(item) });
  } catch (error) {
    console.error("GET SINGLE ITEM ERROR:", error);
    return res.status(400).json({ message: "Invalid item ID or unable to load item." });
  }
});

module.exports = router;
