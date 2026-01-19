import express from 'express';

import { checkout, login } from '../controllers/user.js';
import { handleErrorAsync } from '../utils/handleError.js';
import { loginValidator } from '../validators/user.validator.js';
import { handleValidation } from '../middlewares/validateMiddleware.js';

import type { Request, Response, NextFunction } from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

// 登入
router.post(
  '/login',
  loginValidator,
  handleValidation,
  handleErrorAsync(login),
);

// 登入驗證
router.post('/check', handleErrorAsync(checkout));

export default router;
