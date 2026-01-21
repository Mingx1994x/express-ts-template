import { getCategoryRows } from '../service/categoriesSheet.js';

import type { Request, Response, NextFunction } from 'express';

// 取得類別列表
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const resData = await getCategoryRows();
  res.status(200).json({
    status: 'success',
    data: resData,
  });
};
