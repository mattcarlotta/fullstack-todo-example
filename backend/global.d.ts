import { Request } from 'express';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            JWT_SECRET: string;
        }
    }
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export {};
