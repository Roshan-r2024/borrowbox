const express = require("express");
const BorrowRequest = require("../models/BorrowRequest");
const Chat = require("../models/Chat");
const Reminder = require("../models/Reminder");

const router = express.Router();
const clean = (v) => String(v || "").trim().toLowerCase();

router.get("/:email", async (req, res) => {
  try {
    const email = clean(decodeURIComponent(req.params.email));
    if (!email) return res.status(400).json({ message: "Email is required." });
    const [requests, chats, reminders] = await Promise.all([
      BorrowRequest.find({ $or: [{ borrowerEmail: email }, { ownerEmail: email }] }).sort({ updatedAt: -1 }).limit(20).lean(),
      Chat.find({ $or: [{ buyerEmail: email }, { sellerEmail: email }] }).sort({ updatedAt: -1 }).limit(20).lean(),
      Reminder.find({ email, remindAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }).sort({ remindAt: 1 }).lean(),
    ]);
    const notifications = [];
    requests.forEach((r) => {
      const isOwner = clean(r.ownerEmail) === email;
      let title = "Order update";
      let message = `${r.itemTitle || "Your order"} is ${r.status}.`;
      if (r.status === "Pending" && isOwner) { title = "New order request"; message = `${r.borrower || "A student"} requested ${r.itemTitle}.`; }
      else if (r.status === "Approved") { title = "Order approved"; message = `${r.itemTitle} was approved.`; }
      else if (r.status === "Rejected") { title = "Order rejected"; message = `${r.itemTitle} was rejected.`; }
      else if (r.status === "Returned") { title = "Item returned"; message = `${r.itemTitle} was marked returned.`; }
      notifications.push({ id: `request-${r._id}`, type: "order", title, message, at: r.updatedAt || r.createdAt, orderId: r._id });
    });
    chats.forEach((c) => {
      const last = c.messages?.[c.messages.length - 1];
      if (!last || clean(last.senderEmail) === email) return;
      notifications.push({ id: `chat-${c._id}-${last._id || last.createdAt}`, type: "chat", title: "New chat message", message: `${last.senderName || "Student"}: ${last.text}`, at: last.createdAt || c.updatedAt, orderId: c.order });
    });
    reminders.forEach((r) => {
      notifications.push({ id: `reminder-${r._id}`, type: "reminder", title: r.title, message: `${r.itemTitle} · ${new Date(r.remindAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`, at: r.remindAt, orderId: r.order, reminderId: r._id });
    });
    notifications.sort((a, b) => new Date(b.at) - new Date(a.at));
    res.json({ notifications: notifications.slice(0, 40) });
  } catch (error) { console.error("NOTIFICATIONS ERROR:", error); res.status(500).json({ message: "Unable to load notifications." }); }
});

module.exports = router;
