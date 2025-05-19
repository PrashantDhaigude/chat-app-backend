const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// MongoDB setup (still present)
const mongoose = require("mongoose");
const MongoDBSting = "mongodb+srv://prashantdhaigude530:6Qm0NdPwjKHGLzv0@chatapplication.jrene.mongodb.net/?retryWrites=true&w=majority&appName=chatapplication";

mongoose
  .connect(MongoDBSting)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));


const userRoutes = require("./src/user/user_route");
app.use("/api", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
