import asyncHandler from "../utils/asyncHnadler.js";
const admin = asyncHandler(async (req, res, next) => {
    if (req.user?.role !== "admin" ||
        req.user?.role !== "superAdmin" ||
        req.user?.role !== "owner") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
});
export default admin;
//# sourceMappingURL=admin.js.map