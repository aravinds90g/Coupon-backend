const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  claimed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Coupon", couponSchema);
