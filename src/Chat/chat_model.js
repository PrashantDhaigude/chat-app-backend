const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const messageSchema = new mongoose.Schema(
  {
    message_id: { type: Number, unique: true },
    message_receiver_id: { type: Number, required: true },
    message_sender_id: { type: Number, required: true }, 
    message_dec: { type: String, required: false },
    message_status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

messageSchema.plugin(AutoIncrement, { inc_field: "message_id" });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
