const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const borrowRequestRoutes = require("./routes/borrowRequests");
const chatRoutes = require("./routes/chats");
const reminderRoutes = require("./routes/reminders");
const notificationRoutes = require("./routes/notifications");
const Item = require("./models/Item");
const demoItems = require("./demoItems");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/borrow-requests", borrowRequestRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/notifications", notificationRoutes);
app.get("/", (req, res) => res.json({ message: "Borrow Box API is running 🚀" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
const PORT = process.env.PORT || 5000;

async function seedDemoItems() {
  try {
    const operations = demoItems.map((item) => ({
      updateOne: {
        filter: { title: item.title, ownerEmail: item.ownerEmail },
        update: { $setOnInsert: item },
        upsert: true,
      },
    }));
    if (!operations.length) return;
    const result = await Item.bulkWrite(operations, { ordered: false });
    const inserted = result.upsertedCount || 0;
    if (inserted) console.log(`Borrow Box demo dataset inserted: ${inserted} items 📦`);
    else console.log("Borrow Box demo dataset already available ✅");
  } catch (error) {
    console.error("Demo dataset seed failed:", error.message);
  }
}

async function connectDatabase() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in server/.env");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    console.log("MongoDB connected successfully ✅");
    await seedDemoItems();
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  }
}

// Start HTTP immediately. The previous flow waited for MongoDB + demo seeding
// before opening port 5000, which could make the browser appear to hang.
app.listen(PORT, () => console.log(`Borrow Box server running on port ${PORT} 🚀`));
connectDatabase();
