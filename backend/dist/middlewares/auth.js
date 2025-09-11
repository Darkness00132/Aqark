import asyncHandler from '../utils/asyncHnadler.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
const auth = asyncHandler(async (req, res, next) => {
    const token = req.cookies['jwt-auth'];
    if (!token) {
        return res.status(401).json({ message: 'غير مصرح لك بدخول' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
        return res.status(404).json({ message: 'الحساب غير موجود' });
    }
    if (user.isBlocked) {
        return res.status(403).json({ message: 'تم حظر حسابك' });
    }
    req.user = user;
    next();
});
export default auth;
//# sourceMappingURL=auth.js.map