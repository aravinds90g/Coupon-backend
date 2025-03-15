const Claim = require("../models/Claim");

const preventAbuse = async (req, res, next) => {
  const ip = req.ip;
  const browserId = req.cookies.browserId || req.headers["user-agent"];

  const existingClaim = await Claim.findOne({
    $or: [{ ip }, { browserId }],
    timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
  });

  if (existingClaim) {
    return res
      .status(429)
      .json({ message: "Wait before claiming another coupon" });
  }

  await Claim.create({ ip, browserId });
  next();
};

module.exports = { preventAbuse };
