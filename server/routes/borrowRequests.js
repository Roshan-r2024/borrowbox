const express = require("express");
const mongoose = require("mongoose");
const BorrowRequest = require("../models/BorrowRequest");
const Item = require("../models/Item");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { itemId, borrower, borrowerEmail, startDate, endDate, message = "", urgency = "Normal" } = req.body;
    if (!itemId || !borrower || !borrowerEmail || !startDate || !endDate) return res.status(400).json({ message: "Please provide all borrow details." });
    if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ message: "Invalid item." });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found." });
    if ((item.status || "Available") !== "Available") return res.status(409).json({ message: "This item is no longer available." });
    if (item.listingType === "sale") return res.status(400).json({ message: "This item is listed for sale, not borrowing." });
    if (item.ownerEmail && item.ownerEmail.toLowerCase() === borrowerEmail.toLowerCase()) return res.status(400).json({ message: "You cannot borrow your own item." });

    const duplicate = await BorrowRequest.findOne({ item: item._id, borrowerEmail: borrowerEmail.toLowerCase(), status: { $in: ["Pending", "Approved"] } });
    if (duplicate) return res.status(409).json({ message: "You already have an active request for this item." });

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return res.status(400).json({ message: "Please choose valid borrow and return dates." });

    const request = await BorrowRequest.create({
      item: item._id, itemTitle: item.title, itemPrice: item.price,
      owner: item.owner, ownerEmail: (item.ownerEmail || "").toLowerCase(),
      borrower: borrower.trim(), borrowerEmail: borrowerEmail.toLowerCase().trim(),
      startDate, endDate, message: message.trim(), urgency: urgency === "Urgent" ? "Urgent" : "Normal",
    });
    res.status(201).json({ message: "Borrow request sent successfully.", request });
  } catch (error) {
    console.error("Create borrow request error:", error);
    res.status(500).json({ message: "Unable to send borrow request." });
  }
});

router.get("/owner/:email", async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ ownerEmail: req.params.email.toLowerCase() }).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) { res.status(500).json({ message: "Unable to load borrow requests." }); }
});

router.get("/borrower/:email", async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ borrowerEmail: req.params.email.toLowerCase() }).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) { res.status(500).json({ message: "Unable to load your borrow requests." }); }
});

router.put("/:id/approve", async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Borrow request not found." });
    if (request.status !== "Pending") return res.status(409).json({ message: "This request has already been processed." });
    const item = await Item.findById(request.item);
    if (!item) return res.status(404).json({ message: "Item not found." });
    if ((item.status || "Available") !== "Available") return res.status(409).json({ message: "This item is already borrowed." });

    request.status = "Approved";
    await request.save();
    item.status = "Borrowed";
    await item.save();
    await BorrowRequest.updateMany({ item: request.item, _id: { $ne: request._id }, status: "Pending" }, { $set: { status: "Rejected" } });
    res.json({ message: "Borrow request approved. Item is now marked as borrowed.", request });
  } catch (error) { res.status(500).json({ message: "Unable to approve borrow request." }); }
});

router.put("/:id/reject", async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Borrow request not found." });
    if (request.status !== "Pending") return res.status(409).json({ message: "This request has already been processed." });
    request.status = "Rejected";
    await request.save();
    res.json({ message: "Borrow request rejected.", request });
  } catch (error) { res.status(500).json({ message: "Unable to reject borrow request." }); }
});

// Owner marks an approved borrow as returned and makes the item available again.
router.put("/:id/return", async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Borrow request not found." });
    if (request.status !== "Approved") return res.status(409).json({ message: "Only an approved borrow can be marked returned." });
    const item = await Item.findById(request.item);
    if (!item) return res.status(404).json({ message: "Item not found." });
    request.status = "Returned";
    await request.save();
    item.status = "Available";
    await item.save();
    res.json({ message: "Item marked as returned and available again.", request });
  } catch (error) { res.status(500).json({ message: "Unable to mark item as returned." }); }
});

module.exports = router;
