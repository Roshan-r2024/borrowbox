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
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    cb(allowed.includes(file.mimetype) ? null : new Error("Only JPG, JPEG, PNG and WEBP images are allowed."), allowed.includes(file.mimetype));
  },
});

const prohibitedPattern = /\b(drug|drugs|cocaine|heroin|meth|methamphetamine|marijuana|cannabis|weed|ganja|hashish|hash|opioid|fentanyl|lsd|mdma|ecstasy|ketamine|amphetamine|narcotic|steroid|steroids|prescription\s+medicine|controlled\s+substance)\b/i;

async function enrichItem(item) {
  const plainItem = item?.toObject ? item.toObject() : item;
  if (!plainItem?.ownerEmail) return { ...plainItem, ownerPhone: "", ownerProfilePicture: "" };
  const user = await User.findOne({ email: String(plainItem.ownerEmail).toLowerCase() }).select("phone profilePicture").lean();
  return { ...plainItem, ownerPhone: user?.phone || "", ownerProfilePicture: user?.profilePicture || "" };
}

router.post("/", (req, res) => {
  upload.single("image")(req, res, async (uploadError) => {
    if (uploadError) return res.status(400).json({ message: uploadError.message || "Image upload failed." });
    try {
      if (!req.file) return res.status(400).json({ message: "Please upload an item image." });
      const { title, category, listingType, price, description, condition, availability, displayStyle, owner, ownerEmail } = req.body;
      if (!title || !category || !price || !description || !condition || !availability) return res.status(400).json({ message: "All item details are required." });
      const textToCheck = `${title} ${category} ${description}`;
      if (prohibitedPattern.test(textToCheck)) return res.status(400).json({ message: "Drugs and controlled substances are strictly prohibited on Borrow Box." });
      const cleanListingType = listingType === "sale" ? "sale" : "rent";
      const numericPrice = Number(price);
      if (!Number.isFinite(numericPrice) || numericPrice < 0) return res.status(400).json({ message: "Please enter a valid price." });
      const item = await Item.create({
        title: title.trim(), category, listingType: cleanListingType, price: numericPrice,
        description: description.trim(), condition, availability, owner: owner || "Student", ownerEmail: ownerEmail || "",
        imageUrl: `/uploads/${req.file.filename}`, displayStyle: displayStyle || "square", status: "Available",
      });
      return res.status(201).json({ message: "Item listed successfully.", item: await enrichItem(item) });
    } catch (error) {
      console.error("CREATE ITEM ERROR:", error);
      return res.status(500).json({ message: "Unable to list item." });
    }
  });
});

router.get("/", async (_req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).lean();
    const emails = [...new Set(items.map(i => String(i.ownerEmail || "").toLowerCase()).filter(Boolean))];
    const users = emails.length ? await User.find({ email: { $in: emails } }).select("email phone profilePicture").lean() : [];
    const userByEmail = new Map(users.map(u => [String(u.email).toLowerCase(), { phone: u.phone || "", profilePicture: u.profilePicture || "" }]));
    return res.status(200).json({ items: items.map(item => ({ ...item, ownerPhone: userByEmail.get(String(item.ownerEmail || "").toLowerCase())?.phone || "", ownerProfilePicture: userByEmail.get(String(item.ownerEmail || "").toLowerCase())?.profilePicture || "" })) });
  } catch (error) {
    console.error("GET ITEMS ERROR:", error);
    return res.status(500).json({ message: "Unable to load items." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Item not found." });
    return res.status(200).json({ item: await enrichItem(item) });
  } catch (error) {
    console.error("GET SINGLE ITEM ERROR:", error);
    return res.status(400).json({ message: "Invalid item ID or unable to load item." });
  }
});

module.exports = router;
