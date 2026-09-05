const express = require("express");
const mongoose = require("mongoose");
const BorrowRequest = require("../models/BorrowRequest");
const Item = require("../models/Item");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { itemId, borrower, borrowerEmail, startDate = "", endDate = "", message = "", urgency = "Normal", requestType = "Borrow" } = req.body;
    if (!itemId || !borrower || !borrowerEmail) return res.status(400).json({ message: "Please provide the required request details." });
    if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ message: "Invalid item." });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found." });
    if ((item.status || "Available") !== "Available") return res.status(409).json({ message: "This item is no longer available." });
    if (item.ownerEmail && item.ownerEmail.toLowerCase() === borrowerEmail.toLowerCase()) return res.status(400).json({ message: "You cannot request your own item." });

    const type = requestType === "Purchase" ? "Purchase" : "Borrow";
    if (type === "Purchase" && item.listingType !== "sale") return res.status(400).json({ message: "This item is listed for rent." });
    if (type === "Borrow" && item.listingType === "sale") return res.status(400).json({ message: "This item is listed for sale." });
    if (type === "Borrow" && (!startDate || !endDate)) return res.status(400).json({ message: "Please provide borrow and return dates." });

    const duplicate = await BorrowRequest.findOne({ item: item._id, borrowerEmail: borrowerEmail.toLowerCase(), requestType: type, status: { $in: ["Pending", "Approved"] } });
    if (duplicate) return res.status(409).json({ message: `You already have an active ${type.toLowerCase()} request for this item.` });

    if (type === "Borrow") {
      const start = new Date(startDate); const end = new Date(endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return res.status(400).json({ message: "Please choose valid borrow and return dates." });
    }

    const request = await BorrowRequest.create({
      item: item._id, itemTitle: item.title, itemPrice: item.price,
      owner: item.owner, ownerEmail: (item.ownerEmail || "").toLowerCase(),
      borrower: borrower.trim(), borrowerEmail: borrowerEmail.toLowerCase().trim(),
      requestType: type, startDate, endDate, message: message.trim(), urgency: urgency === "Urgent" ? "Urgent" : "Normal",
    });
    res.status(201).json({ message: type === "Purchase" ? "Purchase enquiry sent successfully." : "Borrow request sent successfully.", request });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ message: "Unable to send request." });
  }
});

router.get("/owner/:email", async (req, res) => {
  try { const requests = await BorrowRequest.find({ ownerEmail: req.params.email.toLowerCase() }).sort({ createdAt: -1 }); res.json({ requests }); }
  catch { res.status(500).json({ message: "Unable to load requests." }); }
});

router.get("/borrower/:email", async (req, res) => {
  try { const requests = await BorrowRequest.find({ borrowerEmail: req.params.email.toLowerCase() }).sort({ createdAt: -1 }); res.json({ requests }); }
  catch { res.status(500).json({ message: "Unable to load your requests." }); }
});

router.put("/:id/approve", async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found." });
    if (request.status !== "Pending") return res.status(409).json({ message: "This request has already been processed." });
    const item = await Item.findById(request.item);
    if (!item) return res.status(404).json({ message: "Item not found." });
    if ((item.status || "Available") !== "Available") return res.status(409).json({ message: "This item is no longer available." });

    request.status = "Approved"; await request.save();
    item.status = "Borrowed"; await item.save();
    await BorrowRequest.updateMany({ item: request.item, _id: { $ne: request._id }, status: "Pending" }, { $set: { status: "Rejected" } });
    res.json({ message: request.requestType === "Purchase" ? "Purchase request approved." : "Borrow request approved.", request });
  } catch { res.status(500).json({ message: "Unable to approve request." }); }
});

router.put("/:id/reject", async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found." });
    if (request.status !== "Pending") return res.status(409).json({ message: "This request has already been processed." });
    request.status = "Rejected"; await request.save(); res.json({ message: "Request rejected.", request });
  } catch { res.status(500).json({ message: "Unable to reject request." }); }
});

router.put("/:id/return", async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found." });
    if (request.requestType !== "Borrow" || request.status !== "Approved") return res.status(409).json({ message: "Only an approved borrow can be returned." });
    const item = await Item.findById(request.item);
    if (!item) return res.status(404).json({ message: "Item not found." });
    request.status = "Returned"; await request.save(); item.status = "Available"; await item.save();
    res.json({ message: "Item returned and available again.", request });
  } catch { res.status(500).json({ message: "Unable to mark item as returned." }); }
});

module.exports = router;
