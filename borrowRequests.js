const express = require("express");

const BorrowRequest = require("../models/BorrowRequest");
const Item = require("../models/Item");

const router = express.Router();


/* =========================
   CREATE BORROW REQUEST
========================= */

router.post("/", async (req, res) => {

  try {

    const {
      itemId,
      borrower,
      borrowerEmail,
      startDate,
      endDate,
      message,
    } = req.body;


    if (
      !itemId ||
      !borrower ||
      !borrowerEmail ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        message:
          "Required borrow details are missing.",
      });
    }


    const item =
      await Item.findById(itemId);


    if (!item) {
      return res.status(404).json({
        message:
          "Item not found.",
      });
    }


    if (
      item.status &&
      item.status !== "Available"
    ) {
      return res.status(400).json({
        message:
          "This item is not available for borrowing.",
      });
    }


    const start =
      new Date(startDate);

    const end =
      new Date(endDate);


    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return res.status(400).json({
        message:
          "Invalid borrow dates.",
      });
    }


    if (end < start) {
      return res.status(400).json({
        message:
          "End date cannot be before start date.",
      });
    }


    if (
      item.ownerEmail &&
      item.ownerEmail.toLowerCase() ===
        borrowerEmail.toLowerCase()
    ) {
      return res.status(400).json({
        message:
          "You cannot borrow your own item.",
      });
    }


    const existingRequest =
      await BorrowRequest.findOne({
        item: itemId,

        borrowerEmail:
          borrowerEmail.toLowerCase(),

        status: "Pending",
      });


    if (existingRequest) {
      return res.status(400).json({
        message:
          "You already have a pending request for this item.",
      });
    }


    const borrowRequest =
      await BorrowRequest.create({

        item: item._id,

        itemTitle: item.title,

        borrower: borrower.trim(),

        borrowerEmail:
          borrowerEmail
            .trim()
            .toLowerCase(),

        owner: item.owner,

        ownerEmail:
          item.ownerEmail || "",

        startDate: start,

        endDate: end,

        message:
          message
            ? message.trim()
            : "",

        status: "Pending",
      });


    console.log(
      "New borrow request:",
      item.title
    );


    return res.status(201).json({

      message:
        "Borrow request sent successfully.",

      request: borrowRequest,
    });

  } catch (error) {

    console.error(
      "BORROW REQUEST ERROR:",
      error
    );

    return res.status(500).json({

      message:
        "Unable to send borrow request.",
    });
  }
});


/* =========================
   GET REQUESTS FOR OWNER
========================= */

router.get(
  "/owner/:email",
  async (req, res) => {

    try {

      const email =
        req.params.email
          .trim()
          .toLowerCase();


      const requests =
        await BorrowRequest
          .find({
            ownerEmail: email,
          })
          .sort({
            createdAt: -1,
          });


      return res.status(200).json({
        requests,
      });

    } catch (error) {

      console.error(
        "GET OWNER REQUESTS ERROR:",
        error
      );

      return res.status(500).json({

        message:
          "Unable to load borrow requests.",
      });
    }
  }
);


module.exports = router;