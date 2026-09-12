const express = require("express");
const mongoose = require("mongoose");
const BorrowRequest = require("../models/BorrowRequest");
const Chat = require("../models/Chat");
const User = require("../models/User");

const router = express.Router();
const clean = (value) => String(value || "").trim().toLowerCase();

router.post("/", async (req, res) => {
  try {
    const email = clean(req.body.email);
    const orderId = String(req.body.orderId || "");
    if (!email || !mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).json({ message: "Valid order and email are required" });
    const order = await BorrowRequest.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (clean(order.borrowerEmail) !== email && clean(order.ownerEmail) !== email) return res.status(403).json({ message: "You are not part of this order" });
    let chat = await Chat.findOne({ order: order._id });
    if (!chat) {
      chat = await Chat.create({ order: order._id, item: order.item, buyerEmail: order.borrowerEmail, buyerName: order.borrower, sellerEmail: order.ownerEmail, sellerName: order.owner, messages: [] });
    }
    res.json(chat);
  } catch (error) { res.status(500).json({ message: "Unable to create chat" }); }
});

router.get("/user/:email", async (req, res) => {
  try {
    const email = clean(req.params.email);
    const chats = await Chat.find({ $or: [{ buyerEmail: email }, { sellerEmail: email }] }).sort({ updatedAt: -1 }).lean();
    res.json(chats);
  } catch (error) { res.status(500).json({ message: "Unable to load chats" }); }
});

router.get("/:id", async (req, res) => {
  try {
    const email = clean(req.query.email);
    const chat = await Chat.findById(req.params.id).lean();
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (clean(chat.buyerEmail) !== email && clean(chat.sellerEmail) !== email) return res.status(403).json({ message: "You are not part of this chat" });
    res.json(chat);
  } catch (error) { res.status(500).json({ message: "Unable to load chat" }); }
});

router.post("/:id/messages", async (req, res) => {
  try {
    const email = clean(req.body.email);
    const text = String(req.body.text || "").trim();
    if (!email || !text) return res.status(400).json({ message: "Message is required" });
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (clean(chat.buyerEmail) !== email && clean(chat.sellerEmail) !== email) return res.status(403).json({ message: "You are not part of this chat" });
    const user = await User.findOne({ email }).lean();
    chat.messages.push({ senderEmail: email, senderName: user?.nickname || (email === clean(chat.buyerEmail) ? chat.buyerName : chat.sellerName), text });
    await chat.save();
    res.json(chat);
  } catch (error) { res.status(500).json({ message: "Unable to send message" }); }
});

module.exports = router;
