const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const http = require("http"); 
require("dotenv").config();
const userRoutes1 = require("./src/user/UserData/userdata_controller");


const app = express();
const PORT = 5000;

const server = http.createServer(app);
 
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


 

app.use("/api", userRoutes1);

const userRoutes = require("./src/user/user_route");

app.use("/api", userRoutes);


server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
