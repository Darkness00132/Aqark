import { Router } from 'express';
import auth from '../middlewares/auth';
import { getReviews, getMyReviews, createReview, updateReview, deleteReview, } from '../controller/review.controller';
const router = Router();
router.get('/reviews/:publicId', getReviews);
router.get('/reviews/me', auth, getMyReviews);
router.post('/reviews/:publicId', auth, createReview);
router.put('/reviews/:reviewId', auth, updateReview);
router.delete('/reviews/:reviewId', auth, deleteReview);
export default router;
//# sourceMappingURL=review.route.js.map