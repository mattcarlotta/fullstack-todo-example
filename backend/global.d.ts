import { Request } from 'express';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_DOMAIN: string;
            DATABASE_URL: string;
            JWT_SECRET: string;
            PORT: string;
        }
    }
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export {};
