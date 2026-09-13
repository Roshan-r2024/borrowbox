const express = require("express");
const mongoose = require("mongoose");
const Reminder = require("../models/Reminder");
const BorrowRequest = require("../models/BorrowRequest");

const router = express.Router();
const clean = (v) => String(v || "").trim().toLowerCase();

router.post("/", async (req, res) => {
  try {
    const email = clean(req.body.email);
    const orderId = String(req.body.orderId || "");
    const title = String(req.body.title || "Reminder").trim();
    const remindAt = new Date(req.body.remindAt);
    if (!email || !mongoose.isValidObjectId(orderId) || !title || Number.isNaN(remindAt.getTime())) return res.status(400).json({ message: "Valid reminder details are required." });
    if (remindAt <= new Date()) return res.status(400).json({ message: "Reminder time must be in the future." });
    const order = await BorrowRequest.findById(orderId).lean();
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (clean(order.borrowerEmail) !== email && clean(order.ownerEmail) !== email) return res.status(403).json({ message: "You are not part of this order." });
    const reminder = await Reminder.create({ order: order._id, itemTitle: order.itemTitle, email, title, remindAt });
    res.status(201).json({ message: "Reminder saved and synced with notifications.", reminder });
  } catch (error) { console.error("CREATE REMINDER ERROR:", error); res.status(500).json({ message: "Unable to save reminder." }); }
});

router.get("/user/:email", async (req, res) => {
  try {
    const email = clean(decodeURIComponent(req.params.email));
    const reminders = await Reminder.find({ email }).sort({ remindAt: 1 }).lean();
    res.json({ reminders });
  } catch (error) { res.status(500).json({ message: "Unable to load reminders." }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const email = clean(req.body.email || req.query.email);
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found." });
    if (reminder.email !== email) return res.status(403).json({ message: "You cannot remove this reminder." });
    await reminder.deleteOne();
    res.json({ message: "Reminder removed." });
  } catch (error) { res.status(500).json({ message: "Unable to remove reminder." }); }
});

module.exports = router;
