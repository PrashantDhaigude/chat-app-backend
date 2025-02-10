const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema(
  {
    user_id: { type: Number, unique: true }, 
    user_name: { type: String, required: true },
    user_profile: { type: String, default: "" }, 
    user_mob: { type: String, required: false,  },
    user_email: { type: String, required: true,  },
    user_password: { type: String, required: true }, 
    user_status: { type: Number, default: 1 }, 
  },
  { timestamps: true }
);


userSchema.plugin(AutoIncrement, { inc_field: "user_id" });

const User = mongoose.model("User", userSchema);
module.exports = User;
