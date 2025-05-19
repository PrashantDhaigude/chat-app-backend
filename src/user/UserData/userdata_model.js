// models/UserData.js
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema(
  {
    user_data_id: { type: Number, unique: true },
    user_mob_no: { type: String, required: false },
    user_data_name: { type: String, required: false },
    user_call_time: { type: String, default: "" },
    user_call_duration: { type: String, required: false },
    user_status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

userSchema.plugin(AutoIncrement, { inc_field: "user_data_id" });

const UserData = mongoose.model("UserData", userSchema);
module.exports = UserData;
