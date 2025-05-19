const express = require("express");
const router = express.Router();
const UserData = require("./userdata_model");

router.post("/user/data/store", async (req, res) => {
  try {
    const newUser = new UserData(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/user/data/list", async (req, res) => {
  try {
    const users = await UserData.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
