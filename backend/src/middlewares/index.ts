import type { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Middleware } from '../app';

const middleware = new Middleware();

function setUserIdOnRequest(req: Request, _res: Response, next: NextFunction) {
    req.userId = '';
    next();
}

middleware
    .add(cors({ origin: [process.env.CLIENT_DOMAIN], credentials: true }))
    .add(express.json())
    .add(cookieParser())
    .add(morgan('tiny'))
    .add(setUserIdOnRequest);

export default middleware;
