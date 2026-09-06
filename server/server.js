const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const borrowRequestRoutes = require("./routes/borrowRequests");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/borrow-requests", borrowRequestRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "Borrow Box API is running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in server/.env");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`Borrow Box server running on port ${PORT} 🚀`);
    });
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();