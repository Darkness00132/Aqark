const asyncHandler = require("../utils/asyncHnadler");
const User = require("../models/user.model");
const { verify } = require("jsonwebtoken");

const auth = asyncHandler(async (req, res, next) => {
  const token = req.signedCookies["jwt-auth"];
  if (!token) {
    return res.status(401).json({ message: "غير مصرح لك بالدخول" });
  }
  const decoded = verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ message: "الحساب غير موجود" });
  }
  req.user = user;
  next();
});

module.exports = auth;
