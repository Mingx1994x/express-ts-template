import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { appError } from '../utils/handleError.js';
import { generateJwt, verifyJwt } from '../utils/handleJWTAuth.js';
import getLogger from '../utils/logger.js';

import type { Request, Response, NextFunction } from 'express';
import type { UUIDTypes } from 'uuid';

const logger = getLogger('App');

type TUser = {
  id: UUIDTypes;
  email: string;
  nickname: string;
  password?: string;
  google_id?: string;
  role: 'user' | 'admin';
};

// 預設測試帳號
const userList: TUser[] = [
  {
    id: uuid(),
    email: 'Tony01User@test.com',
    nickname: 'Tony',
    password: bcrypt.hashSync('Atest001', 10),
    role: 'admin',
  },
  {
    id: uuid(),
    email: 'Vicky_02User@test.com',
    nickname: 'Vicky',
    password: bcrypt.hashSync('Btest02', 10),
    role: 'user',
  },
];

// 登入功能 API (測試用)
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  // 簡易版資料庫查找用戶是否存在 (待調整)
  const findUser = userList.find((user) => user.email === email);
  if (!findUser) {
    return next(new appError(400, '使用者不存在或密碼輸入錯誤'));
  }

  if (!findUser.password) {
    return next(new appError(400, '此帳號無法使用密碼登入'));
  }

  const isMatch = await bcrypt.compare(password, findUser.password);
  if (!isMatch) {
    return next(new appError(400, '使用者不存在或密碼輸入錯誤'));
  }

  //JWT
  const token = generateJwt({
    id: findUser.id,
    role: findUser.role,
  });

  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: {
        nickname: findUser.nickname,
        role: findUser.role,
      },
    },
  });
};

// 驗證登入狀態功能 API (測試用)
export const checkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Authorization: Bearer xxxxxxx.yyyyyyy.zzzzzzz
  // 確認 token 是否存在並取出 token
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new appError(401, '你尚未登入'));
  }

  // 驗證 token
  const token = authorization.split(' ')[1];

  if (!token) {
    return next(new appError(401, '無效的 token'));
  }

  const decoded = await verifyJwt(token);

  // 在資料庫尋找對應 id 的使用者
  const currentUser = userList.find((user) => user.id === decoded.id);

  if (!currentUser) {
    return next(new appError(401, '無效的 token'));
  }

  res.status(201).json({
    status: 'success',
    data: {
      status: 'success',
      user: {
        id: currentUser.id,
        nickname: currentUser.nickname,
      },
    },
  });
};
