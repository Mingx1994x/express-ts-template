import express from 'express';

import { checkout, getUserList, login, signup } from '../controllers/user.js';
import { handleErrorAsync } from '../utils/handleError.js';
import {
  loginValidator,
  signupValidator,
} from '../validators/user.validator.js';
import { handleValidation } from '../middlewares/validateMiddleware.js';

const router = express.Router();

/* GET users listing. 測試用(待調整) */
router.get('/user-list', handleErrorAsync(getUserList));

// 登入
router.post(
  '/login',
  loginValidator,
  handleValidation,
  handleErrorAsync(login),
);

// 登入驗證
router.post('/check', handleErrorAsync(checkout));

// 註冊
router.post(
  '/signup',
  signupValidator,
  handleValidation,
  handleErrorAsync(signup),
);

export default router;
