import { v4 as uuid } from 'uuid';
import { appError } from '../utils/handleError.js';

import type { Request, Response, NextFunction } from 'express';
import type { UUIDTypes } from 'uuid';

type TUser = {
  id: UUIDTypes;
  name: string;
  gender: 'male' | 'female';
};

const userList: TUser[] = [
  {
    id: uuid(),
    name: 'Tony',
    gender: 'male',
  },
  {
    id: uuid(),
    name: 'Vicky',
    gender: 'female',
  },
];

export const getUsersList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryData = req.query;

  if (!queryData.gender) {
    return res.status(200).json({
      status: 'success',
      data: userList,
    });
  }

  if (queryData.gender !== 'male' && queryData.gender !== 'female') {
    return next(new appError(400, '參數不正確'));
  }

  const usersData = userList.filter((list) => list.gender === queryData.gender);
  return res.status(200).json({
    status: 'success',
    data: usersData,
  });
};
