const express = require("express");
const mongoose = require("mongoose");
const BorrowRequest = require("../models/BorrowRequest");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Item = require("../models/Item");

const router = express.Router();
const cleanEmail = (value) => String(value || "").trim().toLowerCase();
const databaseReady = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: "Database is not connected. Check MongoDB and try again." });
    return false;
  }
  return true;
};
const publicUser = async (email) => {
  const user = await User.findOne({ email: cleanEmail(email) }).select("nickname profilePicture").lean();
  return { name: user?.nickname || "User", profilePicture: user?.profilePicture || "" };
};

// Start or reuse one conversation for a buyer, seller and item.
router.post("/", async (req, res) => {
  try {
    if (!databaseReady(res)) return;
    const email = cleanEmail(req.body?.email);
    const orderId = String(req.body?.orderId || "");
    const itemId = String(req.body?.itemId || "");
    if (!email) return res.status(400).json({ message: "Please sign in before starting a chat." });

    const currentUser = await User.findOne({ email }).select("email nickname").lean();
    if (!currentUser) return res.status(403).json({ message: "Please sign in with a registered Borrow Box account." });

    let item;
    let buyerEmail;
    let sellerEmail;
    let buyerName;
    let sellerName;
    let order = null;

    if (orderId) {
      if (!mongoose.isValidObjectId(orderId)) return res.status(400).json({ message: "Invalid order ID." });
      order = await BorrowRequest.findById(orderId).lean();
      if (!order) return res.status(404).json({ message: "Order not found." });
      buyerEmail = cleanEmail(order.borrowerEmail);
      sellerEmail = cleanEmail(order.ownerEmail);
      if (email !== buyerEmail && email !== sellerEmail) {
        return res.status(403).json({ message: "You are not part of this order." });
      }
      item = await Item.findById(order.item).lean();
      buyerName = order.borrower || "Buyer";
      sellerName = order.owner || "Seller";
    } else {
      if (!mongoose.isValidObjectId(itemId)) {
        return res.status(400).json({ message: "This is not a saved listing. Open a product listed by a registered Borrow Box user to chat." });
      }
      item = await Item.findById(itemId).lean();
      if (!item) return res.status(404).json({ message: "Product not found. Refresh Browse and try again." });
      buyerEmail = email;
      sellerEmail = cleanEmail(item.ownerEmail);
      buyerName = currentUser.nickname || "Buyer";
      sellerName = item.owner || "Seller";
      if (!sellerEmail) return res.status(422).json({ message: "This listing has no seller account attached." });
      if (sellerEmail === email) return res.status(403).json({ message: "You cannot chat with yourself. Choose another seller's item." });
    }

    if (!item) return res.status(404).json({ message: "The item for this conversation no longer exists." });
    if (!buyerEmail || !sellerEmail) return res.status(422).json({ message: "Buyer or seller account details are missing." });

    const [buyerAccount, sellerAccount] = await Promise.all([
      User.findOne({ email: buyerEmail }).select("email").lean(),
      User.findOne({ email: sellerEmail }).select("email").lean()
    ]);
    if (!buyerAccount || !sellerAccount) {
      return res.status(409).json({ message: "Chat needs two registered accounts. This listing/order has a sample seller without a real account; try an item listed by a registered user." });
    }

    const filter = { buyerEmail, sellerEmail, item: item._id };
    let chat = await Chat.findOne(filter);
    if (!chat) {
      try {
        chat = await Chat.create({
          order: order?._id || null,
          item: item._id,
          itemTitle: item.title || order.itemTitle || "Borrow Box item",
          buyerEmail,
          buyerName,
          sellerEmail,
          sellerName,
          messages: []
        });
      } catch (createError) {
        if (createError.code !== 11000) throw createError;
        chat = await Chat.findOne(filter);
        if (!chat) throw createError;
      }
    } else if (order && !chat.order) {
      chat.order = order._id;
      await chat.save();
    }
    return res.json(chat);
  } catch (error) {
    console.error("CHAT CREATE ERROR:", error);
    return res.status(500).json({ message: "Could not start the chat. Check the backend terminal and MongoDB connection." });
  }
});

// List conversations for a registered account.
router.get("/user/:email", async (req, res) => {
  try {
    if (!databaseReady(res)) return;
    const email = cleanEmail(req.params.email);
    if (!email) return res.status(400).json({ message: "Account email is required." });
    const account = await User.findOne({ email }).select("email").lean();
    if (!account) return res.status(404).json({ message: "Account not found. Please sign in again." });
    const chats = await Chat.find({ $or: [{ buyerEmail: email }, { sellerEmail: email }] }).sort({ updatedAt: -1 }).lean();
    const result = await Promise.all(chats.map(async (chat) => {
      const otherEmail = cleanEmail(chat.buyerEmail) === email ? chat.sellerEmail : chat.buyerEmail;
      const other = await publicUser(otherEmail);
      return { ...chat, otherName: other.name, otherProfilePicture: other.profilePicture };
    }));
    return res.json(result);
  } catch (error) {
    console.error("LOAD CHATS ERROR:", error);
    return res.status(500).json({ message: "Unable to load conversations. Check MongoDB and try again." });
  }
});

// Get a conversation only for one of its participants.
router.get("/:id", async (req, res) => {
  try {
    if (!databaseReady(res)) return;
    const id = String(req.params.id || "");
    const email = cleanEmail(req.query.email);
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid conversation ID. Reopen Chat from the item page." });
    if (!email) return res.status(400).json({ message: "Account email is required." });
    const chat = await Chat.findById(id).lean();
    if (!chat) return res.status(404).json({ message: "Conversation not found. Start a new chat from the item page." });
    if (cleanEmail(chat.buyerEmail) !== email && cleanEmail(chat.sellerEmail) !== email) {
      return res.status(403).json({ message: "You are not a participant in this conversation." });
    }
    const [buyer, seller] = await Promise.all([publicUser(chat.buyerEmail), publicUser(chat.sellerEmail)]);
    return res.json({ ...chat, buyerProfilePicture: buyer.profilePicture, sellerProfilePicture: seller.profilePicture });
  } catch (error) {
    console.error("GET CHAT ERROR:", error);
    return res.status(500).json({ message: "Unable to open this conversation. Try again." });
  }
});

// Persist a message and return the saved conversation.
router.post("/:id/messages", async (req, res) => {
  try {
    if (!databaseReady(res)) return;
    const id = String(req.params.id || "");
    const email = cleanEmail(req.body?.email);
    const messageText = String(req.body?.text || "").trim();
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid conversation ID. Reopen the chat and try again." });
    if (!email || !messageText) return res.status(400).json({ message: "Type a message before sending." });
    if (messageText.length > 2000) return res.status(400).json({ message: "Messages must be 2000 characters or fewer." });

    const chat = await Chat.findById(id);
    if (!chat) return res.status(404).json({ message: "Conversation not found. Start a new chat from the item page." });
    if (cleanEmail(chat.buyerEmail) !== email && cleanEmail(chat.sellerEmail) !== email) {
      return res.status(403).json({ message: "You are not a participant in this conversation." });
    }
    const sender = await User.findOne({ email }).select("nickname").lean();
    if (!sender) return res.status(403).json({ message: "Your account could not be found. Please sign in again." });
    chat.messages.push({
      senderEmail: email,
      senderName: sender.nickname || (email === cleanEmail(chat.buyerEmail) ? chat.buyerName : chat.sellerName) || "User",
      text: messageText
    });
    await chat.save();
    return res.json(chat);
  } catch (error) {
    console.error("SEND CHAT MESSAGE ERROR:", error);
    return res.status(500).json({ message: "Message was not saved. Check the backend terminal and MongoDB connection." });
  }
});

module.exports = router;
