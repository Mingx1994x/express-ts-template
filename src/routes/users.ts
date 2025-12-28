import express from 'express';

import { getUsersList } from '../controllers/user.js';

import type { Request, Response, NextFunction } from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

// 建立測試 userList API
router.get('/list', getUsersList);

export default router;
