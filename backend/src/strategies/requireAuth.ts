import type { NextFunction, Request, Response } from 'express';
import type { SESSION_PAYLOAD_TYPE } from 'types';
import jwt from 'jsonwebtoken';
import { SESSION_PAYLOAD, SESSION_TOKEN } from 'types';
import { AuthValidationError } from '../utils/error';
import { user } from '../app';
import chalk from 'chalk';

function validateToken<T>(token: string) {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as T;
        return payload;
    } catch (error) {
        console.warn(chalk.yellow(error));
        return null;
    }
}

export default async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const cookieSession = SESSION_TOKEN.safeParse(req.cookies);
    if (!cookieSession.success) throw new AuthValidationError('You must be signed in to do that!');

    const { SESSION_TOKEN: token } = cookieSession.data;

    const payload = validateToken<SESSION_PAYLOAD_TYPE>(token);
    const parsedPayload = SESSION_PAYLOAD.safeParse(payload);
    if (!parsedPayload.success) {
        res.clearCookie('SESSION_TOKEN');
        throw new AuthValidationError('Unable to verify session.');
    }

    const { userId } = parsedPayload.data;

    const existingUser = await user.findUnique({ where: { id: userId } });
    if (!existingUser) {
        res.clearCookie('SESSION_TOKEN');
        throw new AuthValidationError('Unable to verify session.');
    }

    req.userId = userId;

    return next();
}
