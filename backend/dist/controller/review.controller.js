import asyncHandler from "../utils/asyncHnadler.js";
import { User, Review } from "../models/associations.js";
import sanitizeXSS from "../utils/sanitizeXSS.js";
export const getReviews = asyncHandler(async (req, res) => {
    const { slug } = sanitizeXSS(req.params);
    const user = await User.findOne({ where: { slug } });
    if (!user) {
        return res.status(404).json({ message: "لم يتم العثور على المستخدم" });
    }
    const reviews = await Review.findAll({
        where: { reviewedUserId: user.id },
        include: [{ model: User, as: "reviewer" }],
    });
    res.status(200).json({ reviews });
});
export const getMyReviews = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const reviews = await Review.findAll({
        where: { reviewerId: userId },
        include: [{ model: User, as: "reviewedUser" }],
    });
    res.status(200).json({ reviews });
});
export const createReview = asyncHandler(async (req, res) => {
    const { slug } = sanitizeXSS(req.params);
    const { rating, comment } = req.body;
    const user = await User.findOne({ where: { slug } });
    if (!user) {
        return res.status(404).json({ message: "لم يتم العثور على المستخدم" });
    }
    if (req.user.id === user.id) {
        return res.status(400).json({ message: "لا يمكنك مراجعة نفسك" });
    }
    const existingReview = await Review.findOne({
        where: { reviewerId: req.user.id, reviewedUserId: user.id },
    });
    if (existingReview) {
        return res
            .status(400)
            .json({ message: "لقد قمت بمراجعة هذا المستخدم بالفعل" });
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
    const { reviewId } = sanitizeXSS(req.params);
    const { rating, comment } = req.body;
    const review = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({ message: "لم يتم العثور على المراجعة" });
    }
    if (rating)
        review.rating = rating;
    if (comment)
        review.comment = comment;
    await review.save();
    res.status(200).json({ review });
});
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = sanitizeXSS(req.params);
    const review = await Review.destroy({ where: { id: reviewId } });
    if (!review) {
        return res.status(404).json({ message: "لم يتم العثور على المراجعة" });
    }
    res.status(200).json({ message: "تم حذف المراجعة بنجاح" });
});
//# sourceMappingURL=review.controller.js.map