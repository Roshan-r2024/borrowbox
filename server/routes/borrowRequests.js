const express = require("express");
const mongoose = require("mongoose");
const BorrowRequest = require("../models/BorrowRequest");
const Item = require("../models/Item");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { itemId, borrower, borrowerEmail, startDate, endDate, message, urgency, requestType } = req.body;
    if (!itemId || !borrower || !borrowerEmail) return res.status(400).json({ message: "Required request details are missing." });
    if (!mongoose.isValidObjectId(itemId)) return res.status(400).json({ message: "Invalid item." });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found." });
    if (item.status !== "Available") return res.status(400).json({ message: "This item is not available." });
    if (item.ownerEmail && item.ownerEmail.toLowerCase() === borrowerEmail.trim().toLowerCase()) return res.status(400).json({ message: "You cannot request your own item." });

    const type = requestType === "Purchase" || item.listingType === "sale" ? "Purchase" : "Borrow";
    let start = null;
    let end = null;
    if (type === "Borrow") {
      if (!startDate || !endDate) return res.status(400).json({ message: "Please select both borrow dates." });
      start = new Date(startDate);
      end = new Date(endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return res.status(400).json({ message: "Invalid borrow dates." });
      if (end < start) return res.status(400).json({ message: "Return date cannot be before borrow date." });
    }

    const existing = await BorrowRequest.findOne({ item: itemId, borrowerEmail: borrowerEmail.trim().toLowerCase(), status: "Pending" });
    if (existing) return res.status(400).json({ message: "You already have a pending request for this item." });

    const request = await BorrowRequest.create({
      item: item._id, itemTitle: item.title, itemPrice: item.price, requestType: type,
      borrower: borrower.trim(), borrowerEmail: borrowerEmail.trim().toLowerCase(), owner: item.owner,
      ownerEmail: item.ownerEmail || "", startDate: start, endDate: end, message: message?.trim() || "",
      urgency: urgency === "Urgent" ? "Urgent" : "Normal", status: "Pending",
    });
    return res.status(201).json({ message: type === "Purchase" ? "Purchase enquiry sent successfully." : "Borrow request sent successfully.", request });
  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);
    return res.status(500).json({ message: "Unable to send request." });
  }
});

router.get("/borrower/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).trim().toLowerCase();
    const requests = await BorrowRequest.find({ borrowerEmail: email }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ requests });
  } catch (error) {
    console.error("GET BORROWER REQUESTS ERROR:", error);
    return res.status(500).json({ message: "Unable to load your requests." });
  }
});

router.get("/owner/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).trim().toLowerCase();
    const requests = await BorrowRequest.find({ ownerEmail: email }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ requests });
  } catch (error) {
    console.error("GET OWNER REQUESTS ERROR:", error);
    return res.status(500).json({ message: "Unable to load incoming requests." });
  }
});

router.put("/:id/:action", async (req, res) => {
  try {
    const { id, action } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid request." });
    if (!["approve", "reject", "return"].includes(action)) return res.status(400).json({ message: "Invalid request action." });

    const request = await BorrowRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found." });

    if (action === "approve") {
      if (request.status !== "Pending") return res.status(400).json({ message: "This request has already been processed." });
      const item = await Item.findById(request.item);
      if (!item || item.status !== "Available") return res.status(400).json({ message: "The item is no longer available." });
      request.status = "Approved";
      await request.save();
      item.status = request.requestType === "Purchase" ? "Sold" : "Borrowed";
      await item.save();
      return res.status(200).json({ message: request.requestType === "Purchase" ? "Purchase enquiry approved." : "Borrow request approved.", request });
    }

    if (action === "reject") {
      if (request.status !== "Pending") return res.status(400).json({ message: "This request has already been processed." });
      request.status = "Rejected";
      await request.save();
      return res.status(200).json({ message: "Request rejected.", request });
    }

    if (request.requestType !== "Borrow" || request.status !== "Approved") return res.status(400).json({ message: "Only an approved borrow request can be returned." });
    request.status = "Returned";
    await request.save();
    const item = await Item.findById(request.item);
    if (item) { item.status = "Available"; await item.save(); }
    return res.status(200).json({ message: "Item marked as returned and available again.", request });
  } catch (error) {
    console.error("PROCESS REQUEST ERROR:", error);
    return res.status(500).json({ message: "Unable to process request." });
  }
});

module.exports = router;
