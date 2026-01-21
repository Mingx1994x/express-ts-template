import { body } from 'express-validator';
import { requiredValidator } from '../utils/validateUtils.js';

import type { ValidationChain } from 'express-validator';
import { isExistEmail } from '../service/usersSheet.js';

const validateEmailChain = (): ValidationChain => {
  return body('email')
    .trim()
    .notEmpty()
    .withMessage('信箱欄位必填')
    .isEmail()
    .withMessage('Email 格式錯誤');
};

/**
 * 密碼規則
 * 長度 6～12
 * 至少包含 1 個小寫字母、1 個大寫字母、1 個數字
 * 只允許英文字母與數字
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,12}$/;
const validatePasswordChain = (
  field = 'password',
  label = '密碼欄位',
): ValidationChain =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${label}必填`)
    .bail()
    .matches(passwordRegex)
    .withMessage(
      `${label}格式錯誤，長度需 6～12，至少包含 1 個小寫字母、1 個大寫字母、1 個數字`,
    );

const validateEmailAvailable = () => {
  return body('email').custom(async (email) => {
    const isExist = await isExistEmail(email);
    if (isExist) {
      throw new Error('信箱已被使用');
    }
    return true;
  });
};

export const signupValidator: ValidationChain[] = [
  requiredValidator('nickname', '暱稱欄位'),
  validateEmailChain(),
  validateEmailAvailable(),
  validatePasswordChain(),
];

export const loginValidator: ValidationChain[] = [
  requiredValidator('password', '密碼欄位'),
  validateEmailChain(),
];
