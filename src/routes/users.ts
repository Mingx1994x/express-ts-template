import express from 'express';

import { checkout, login } from '../controllers/user.js';

import type { Request, Response, NextFunction } from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

// 建立測試 userList API
// router.get('/list', getUsersList);

// 登入
router.post('/', login);

// 登入驗證
router.post('/check', checkout);

export default router;
