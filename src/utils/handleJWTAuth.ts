import jwt from 'jsonwebtoken';
import { configManager } from '../config/index.js';
import { appError } from './handleError.js';

import type { UUIDTypes } from 'uuid';
import type { SignOptions } from 'jsonwebtoken';
type TAccessPayload = {
  id: UUIDTypes;
  role: 'user' | 'admin';
};

const JWT_EXPIRES_IN = configManager.jwt.expiresDay;
const JWT_SECRET = configManager.jwt.secret;

export const generateJwt = (payload: TAccessPayload) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);

export const verifyJwt = (token: string): TAccessPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'id' in decoded &&
      'role' in decoded &&
      typeof decoded.id === 'string' &&
      (decoded.role === 'user' || decoded.role === 'admin')
    ) {
      return decoded as TAccessPayload;
    }

    throw new appError(401, 'Token payload 格式錯誤');
  } catch (error) {
    if (error instanceof Error) {
      switch (error.name) {
        case 'TokenExpiredError':
          throw new appError(401, 'Token 已過期');
        case 'JsonWebTokenError':
          throw new appError(401, '無效的 token');
        default:
          throw error;
      }
    }
    throw new appError(401, 'Token 驗證失敗');
  }
};
