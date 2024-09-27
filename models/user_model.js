const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    chatId: String,
    alerts: [
      {
        tokenSymbol: String,
        priceThreshold: Number
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;