import type { NextFunction, Request, Response } from 'express';
import * as z from 'zod';
import jwt from 'jsonwebtoken';
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

const JwtPayload = z.object({
    userId: z.string(),
    iat: z.number(),
    exp: z.number()
});

export default async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get('authorization');
    const token = authHeader?.split(' ')[1] || '';
    if (!token) throw new AuthValidationError('You must be signed in to do that!');

    const payload = validateToken<z.infer<typeof JwtPayload>>(token);
    const parsedPayload = JwtPayload.safeParse(payload);
    if (!parsedPayload.success) {
        res.clearCookie('SESSION_TOKEN');
        throw new AuthValidationError('Unable to verify authorization token.');
    }

    const { userId } = parsedPayload.data;

    const existingUser = await user.findUnique({ where: { id: userId } });
    if (!existingUser) {
        res.clearCookie('SESSION_TOKEN');
        throw new AuthValidationError('Unable to verify authorization token.');
    }

    req.userId = userId;

    return next();
}
