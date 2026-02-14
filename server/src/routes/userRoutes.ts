import express from 'express';
import { forgetPassword, getMe, login, logout, register, resetPassword, updateAvatar, updateEmail, updateName, updatePassword } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';
import { forgetPasswordValidator, resetPasswordValidator, updateAvatarRules, updateEmailValidator, updateNameValidator, updatePasswordValidator } from '../validators/userValidator';
import { validate } from '../middlewares/validatorMiddleware';
import { upload } from '../middlewares/multer';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);

router.put('/update-avatar', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
    next();
  });
}, updateAvatar);

router.get('/me', protect, getMe);

router.put(
  '/update-email',
  protect,
  updateEmailValidator,
  validate, // This middleware throws errors if validator fails
  updateEmail
);

router.put(
  '/update-name',
  protect,
  updateNameValidator,
  validate,
  updateName
);

router.put(
  '/update-password',
  protect,
  updatePasswordValidator,
  validate,
  updatePassword
);

router.post(
  '/forget-password-email',
  forgetPasswordValidator,
  validate,
  forgetPassword
);

router.patch(
  '/reset-password/:token',
  resetPasswordValidator,
  validate,
  resetPassword
);


export default router;