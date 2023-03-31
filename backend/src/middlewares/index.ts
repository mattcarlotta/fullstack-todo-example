import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import app from '../app';

const middleware = app.createMiddleware();

function setUserIdOnRequest(req: Request, _res: Response, next: NextFunction) {
    req.userId = '';
    next();
}

middleware.use(express.json()).use(morgan('tiny')).use(setUserIdOnRequest);
