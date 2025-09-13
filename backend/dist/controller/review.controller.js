import asyncHandler from '../utils/asyncHnadler';
import Review from '../models/review.model';
import User from '../models/user.model';
export const getReviews = asyncHandler(async (req, res) => {
    const { publicId } = req.secureParams;
    const user = await User.findOne({ where: { publicId } });
    if (!user) {
        return res.status(404).json({ message: 'لم يتم العثور على المستخدم' });
    }
    const reviews = await Review.findAll({
        where: { reviewedUserId: user.id },
        include: [{ model: User, as: 'reviewer' }],
    });
    res.json({ reviews });
});
export const getMyReviews = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const reviews = await Review.findAll({
        where: { reviewerId: userId },
        include: [{ model: User, as: 'reviewedUser' }],
    });
    res.json({ reviews });
});
export const createReview = asyncHandler(async (req, res) => {
    const { publicId } = req.params;
    const { rating, comment } = req.body;
    const user = await User.findOne({ where: { publicId } });
    if (!user) {
        return res.status(404).json({ message: 'لم يتم العثور على المستخدم' });
    }
    const review = await Review.create({
        reviewerId: req.user.id,
        reviewedUserId: user.id,
        rating,
        comment,
    });
    res.status(201).json({ review });
});
export const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({ message: 'لم يتم العثور على المراجعة' });
    }
    if (rating)
        review.rating = rating;
    if (comment)
        review.comment = comment;
    await review.save();
    res.json({ review });
});
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.destroy({ where: { id: reviewId } });
    if (!review) {
        return res.status(404).json({ message: 'لم يتم العثور على المراجعة' });
    }
    res.status(204).json({ message: 'تم حذف المراجعة بنجاح' });
});
//# sourceMappingURL=review.controller.js.map