import asyncHandler from "../utils/asyncHnadler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
const auth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "غير مصرح لك بالدخول" });
    }
    const token = authHeader.split(" ")[1] ?? "";
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "JWT secret not set" });
    }
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(404).json({ message: "الحساب غير موجود" });
    }
    req.user = user;
    next();
});
// const token = req.signedCookies["jwt-auth"];
// if (!token) {
//   return res.status(401).json({ message: "غير مصرح لك بالدخول" });
// }
export default auth;
