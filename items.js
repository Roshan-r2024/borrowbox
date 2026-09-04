const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Item = require("../models/Item");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG and PNG images are allowed."));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});


/* =========================
   POST - CREATE ITEM
========================= */

router.post("/", (req, res) => {
  upload.single("image")(req, res, async (uploadError) => {

    if (uploadError) {
      console.error("UPLOAD ERROR:", uploadError.message);

      return res.status(400).json({
        message:
          uploadError.message || "Image upload failed.",
      });
    }

    try {

      if (!req.file) {
        return res.status(400).json({
          message: "Please upload an item image.",
        });
      }

      const {
        title,
        category,
        price,
        description,
        condition,
        availability,
        displayStyle,
        owner,
        ownerEmail,
      } = req.body;


      if (
        !title ||
        !category ||
        price === undefined ||
        !description ||
        !condition ||
        !availability
      ) {
        return res.status(400).json({
          message: "All item details are required.",
        });
      }


      const imageUrl =
        `/uploads/${req.file.filename}`;


      const item = await Item.create({

        title: title.trim(),

        category,

        price: Number(price),

        description: description.trim(),

        condition,

        availability,

        owner: owner || "Student",

        ownerEmail: ownerEmail || "",

        imageUrl,

        displayStyle:
          displayStyle || "square",

        status: "Available",
      });


      console.log(
        "New item listed:",
        item.title
      );


      return res.status(201).json({

        message:
          "Item listed successfully.",

        item,
      });

    } catch (error) {

      console.error(
        "CREATE ITEM ERROR:",
        error
      );

      return res.status(500).json({

        message:
          "Unable to list item.",
      });
    }
  });
});


/* =========================
   GET - ALL ITEMS
========================= */

router.get("/", async (req, res) => {

  try {

    const items =
      await Item.find()
        .sort({ createdAt: -1 });


    return res.status(200).json({
      items,
    });

  } catch (error) {

    console.error(
      "GET ITEMS ERROR:",
      error
    );

    return res.status(500).json({

      message:
        "Unable to load items.",
    });
  }
});


module.exports = router;


