const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const PORT = 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const MongoDBSting = "mongodb+srv://prashantdhaigude530:6Qm0NdPwjKHGLzv0@chatapplication.jrene.mongodb.net/?retryWrites=true&w=majority&appName=chatapplication"
mongoose
  .connect(MongoDBSting)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));


app.use((req, res, next) => {
  req.io = io;
  next();
});


const messageRoutes = require("./src/Chat/chat_route");
app.use("/api", messageRoutes);
const userRoutes = require("./src/user/user_route");

app.use("/api", userRoutes);

io.on("connection", (socket) => {
  console.log(`🔗 New Client Connected: ${socket.id}`);

  socket.on("newMessage", (msg) => {
    console.log("📩 New Message Received:", msg);
    io.emit("message", msg); 
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client Disconnected: ${socket.id}`);
  });       
});


server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
