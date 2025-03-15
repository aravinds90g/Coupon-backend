const express = require("express");
const { claimCoupon } = require("../controllers/couponController");

const router = express.Router();

// 📌 Route to claim a coupon
router.post("/claim", claimCoupon);

// 📌 Route to claim a coupon
module.exports = router;
