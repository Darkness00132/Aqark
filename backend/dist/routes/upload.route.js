import auth from '../middlewares/auth.js';
import multer from 'multer';
import path from 'path';
import { deleteAdImages, uploadAdImages, uploadAvatar, } from '../controller/upload.controller.js';
import { Router } from 'express';
const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
            const ext = path.extname(file.originalname).toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                return cb(new Error('فقط الصور بصيغ PNG, JPG, JPEG, WEBP مسموح بها'));
            }
            cb(null, true);
        }
        else {
            cb(new Error('فقط الصور مسموح بها'));
        }
    },
});
router.put('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.post('/adImages', auth, upload.array('images', 10), uploadAdImages);
router.delete('/images', auth, deleteAdImages);
export default router;
//# sourceMappingURL=upload.route.js.map