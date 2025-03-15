const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  lastClaimed: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ClaimRecord", claimSchema);
