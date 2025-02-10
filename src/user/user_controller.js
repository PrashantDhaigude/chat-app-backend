const path = require("path");
const User = require("./user_model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const index = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const store = async (req, res) => {
  try {
    const rootPath = process.cwd();
    const { user_name, user_mob, user_email, user_password, user_status } = req.body;

    const validateAndMove = (file, uploadPath) => {
      return new Promise((resolve, reject) => {
        if (!file || !file.name) {
          return resolve(null);
        }

        const fileName = Date.now() + path.extname(file.name);
        const filePath = path.join(uploadPath, fileName);

        file.mv(filePath, (err) => {
          if (err) {
            console.error("Error moving file:", err);
            return reject(err);
          }
          resolve(fileName);
        });
      });
    };

    let userProfileFilename = null;

    if (req.files && req.files.user_profile) {
      const userProfile = req.files.user_profile;
      const uploadDir = path.join(rootPath, "public/userprofile");
      userProfileFilename = await validateAndMove(userProfile, uploadDir);
    }

   
    const hashedPassword = await bcrypt.hash(user_password, 10);

    const newUser = await User.create({
      user_name,
      user_profile: userProfileFilename,
      user_mob,
      user_email,
      user_password: hashedPassword, 
      user_status,
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const update = async (req, res) => {
    try {
      const rootPath = process.cwd();
      const { user_id, user_password, ...updateData } = req.body;
  
      if (!user_id) {
        return res.status(400).json({ message: "User ID is required for update" });
      }
  
     
      const existingUser = await User.findOne({ user_id });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      if (user_password) {
        const saltRounds = 10;
        updateData.user_password = await bcrypt.hash(user_password, saltRounds);
      }
  
      
      if (req.files && req.files.user_profile) {
        const uploadDir = path.join(rootPath, "public/userprofile");
  
        if (existingUser.user_profile) {
          const oldImagePath = path.join(uploadDir, existingUser.user_profile);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); 
          }
        }
  

        const userProfile = req.files.user_profile;
        const fileName = Date.now() + path.extname(userProfile.name);
        const filePath = path.join(uploadDir, fileName);
  
        await userProfile.mv(filePath);
        updateData.user_profile = fileName; 
      }

      const updatedUser = await User.findOneAndUpdate({ user_id }, updateData, {
        new: true,
      });
  
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  

  const Login = async (req, res) => {
    try {
      const { user_email, user_password } = req.body;
  
      console.log("Login Request Email:", user_email);
      
      // 🔹 If using MongoDB (Mongoose)
      const user = await User.findOne({ user_email });
  
      // 🔹 If using Sequelize
      // const user = await User.findOne({ where: { user_email } });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(user_password, user.user_password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Ensure JWT_SECRET exists
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Server error: JWT_SECRET missing" });
      }
  
      const token = jwt.sign(
        { id: user.user_id, email: user.user_email },
        process.env.JWT_SECRET,  // Make sure this is defined!
        { expiresIn: "1h" }
      );
      
  
      res.json({ token, user });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  



const deleted = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { index, show, store, update, deleted ,Login };
