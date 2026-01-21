import express from 'express';
import { handleErrorAsync } from '../utils/handleError.js';
import { getCategories } from '../controllers/category.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.get('/', isAuth, handleErrorAsync(getCategories));

export default router;
