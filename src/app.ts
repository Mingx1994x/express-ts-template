import express from 'express';
import path from 'path';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import getLogger from './utils/logger.js';

import type { Request, Response, NextFunction } from 'express';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

const logger = getLogger('App');

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        req.body = req.raw.body;
        return req;
      },
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  next(err);
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;
