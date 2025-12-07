import jwt from "jsonwebtoken";
export const blockIfLoggedIn = (req, res, next) => {
    const token = req.cookies["jwt-auth"];
    if (!token)
        return next(); // No token → allow login
    try {
        // Token exists AND is valid → user is logged in
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(400).json({
            message: "You are already logged in",
        });
    }
    catch {
        // Token exists but invalid/expired → allow login
        return next();
    }
};
//# sourceMappingURL=blockIfLoggedIn.js.map