const Coupon = require("../models/Coupon");
const ClaimRecord = require("../models/Claim");


let lastAssignedIndex = 0;

exports.claimCoupon = async (req, res) => {
  try {
    const userIP = req.ip;
    console.log("User IP:", userIP);

   

    const existingClaim = await ClaimRecord.findOne({ ip: userIP });

    if (existingClaim) {
      const lastClaimedTime = new Date(existingClaim.lastClaimed);
      const now = new Date();
      const diffInMinutes = (now - lastClaimedTime) / (1000 * 60);

      if (diffInMinutes < 60) {
        return res.status(429).json({
          message: `You must wait ${
            60 - Math.floor(diffInMinutes)
          } minutes before claiming another coupon.`,
        });
      }
    }

    console.log("Fetching unclaimed coupons...");
    const coupons = await Coupon.find({ claimed: false });
    console.log("Coupons fetched:", coupons);

    if (coupons.length === 0) {
      return res.status(400).json({ message: "No coupons available!" });
    }

    const coupon = coupons[lastAssignedIndex % coupons.length];
    lastAssignedIndex = (lastAssignedIndex + 1) % coupons.length;

    coupon.claimed = true;
    await coupon.save();
    console.log("Coupon marked as claimed:", coupon);

    if (existingClaim) {
      existingClaim.lastClaimed = new Date();
      await existingClaim.save();
      console.log("Updated claim record:", existingClaim);
    } else {
      await ClaimRecord.create({ ip: userIP, lastClaimed: new Date() });
      console.log("New claim record created for IP:", userIP);
    }

    res.json({ message: "Coupon claimed!", couponCode: coupon.code });
  } catch (error) {
    console.error("Error in claimCoupon:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
