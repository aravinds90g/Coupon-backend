const express = require("express");
const { claimCoupon } = require("../controllers/couponController");

const router = express.Router();

// 📌 Route to claim a coupon
router.post("/claim", claimCoupon);

module.exports = router;
