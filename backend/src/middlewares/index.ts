import type { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import app from '../app';

const middleware = app.createMiddleware();

function setUserIdOnRequest(req: Request, _res: Response, next: NextFunction) {
    req.userId = '';
    next();
}

middleware
    .use(cors({ origin: [process.env.CLIENT_DOMAIN], credentials: true }))
    .use(express.json())
    .use(cookieParser())
    .use(morgan('tiny'))
    .use(setUserIdOnRequest);
