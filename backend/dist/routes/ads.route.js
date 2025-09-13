import { Router } from 'express';
import auth from '../middlewares/auth';
import { getAllAds, getAdById, createAd, updateAd, deleteAd, } from '../controller/ads.controller';
const router = Router();
router.get('/ads', getAllAds);
router.get('/ads/:publicId', getAdById);
router.post('/ads', auth, createAd);
router.put('/ads', auth, updateAd);
router.delete('/ads', auth, deleteAd);
//# sourceMappingURL=ads.route.js.map