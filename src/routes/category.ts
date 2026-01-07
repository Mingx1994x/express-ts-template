import express from 'express';
import { appError } from '../utils/handleError.js';
import getLogger from '../utils/logger.js';
import { getCategoryRows } from '../service/categoriesSheet.js';

import type { Request, Response, NextFunction } from 'express';

const router = express.Router();

const logger = getLogger('App');

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const categories = await getCategoryRows();
    const resData = await getCategoryRows();
    res.status(200).json({
      status: 'success',
      data: resData,
    });
  } catch (error) {
    logger.error(error);
    next(new appError(500, '無法讀取類別資料'));
  }
});

export default router;
