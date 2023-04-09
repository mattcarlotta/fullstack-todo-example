import { PrismaClient } from '@prisma/client';
import type { NextFunction, Response, Request, Router } from 'express';
import chalk from 'chalk';
import express from 'express';

export type Controller = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<Response> | Promise<void> | Response | void;
type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;
type Method = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export class Middleware {
    private middlewares: ExpressMiddleware[];

    constructor() {
        this.middlewares = [];
    }

    public add(middleware: ExpressMiddleware) {
        this.middlewares.push(middleware);
        return this;
    }

    public getMiddleware() {
        return this.middlewares;
    }
}

export class AppRouter {
    private router: Router;
    private pathPrefix: string;

    constructor() {
        this.router = express.Router();
        this.pathPrefix = '';
    }

    public errorHandler =
        (controller: Controller) => async (req: Request, res: Response, next: NextFunction) => {
            try {
                const response = await controller(req, res, next);
                return response;
            } catch (error: any) {
                console.error(chalk.red(error.stack));
                return res.status(error?.statusCode || 500).send(error?.message);
            }
        };

    public addController(method: Method, path: string, controllers: Controller[]) {
        const errorHandledControllers = controllers.map((controller) =>
            this.errorHandler(controller)
        );

        this.router[method](path, errorHandledControllers);
        return this;
    }

    public all(path: string, ...controllers: Controller[]) {
        return this.addController('all', path, controllers);
    }

    public delete(path: string, ...controllers: Controller[]) {
        return this.addController('delete', path, controllers);
    }

    public get(path: string, ...controllers: Controller[]) {
        return this.addController('get', path, controllers);
    }

    public head(path: string, ...controllers: Controller[]) {
        return this.addController('head', path, controllers);
    }

    public options(path: string, ...controllers: Controller[]) {
        return this.addController('options', path, controllers);
    }

    public patch(path: string, ...controllers: Controller[]) {
        return this.addController('patch', path, controllers);
    }

    public post(path: string, ...controllers: Controller[]) {
        return this.addController('post', path, controllers);
    }

    public put(path: string, ...controllers: Controller[]) {
        return this.addController('put', path, controllers);
    }

    public getRouter() {
        return this.router;
    }

    public getPrefix() {
        return this.pathPrefix;
    }

    public prefixPathsWith(prefixPath: string) {
        if (!this.pathPrefix) {
            this.pathPrefix = prefixPath;
        }
        return this;
    }

    // public use(prefix = '') {
    //     this.app.use('/api'.concat(prefix), this.router);
    // }
}

class App {
    private static _instance: App;
    private app = express();
    private static _prismaClient: PrismaClient;

    static getApp() {
        if (!this._instance) {
            this._instance = new App();
        }
        return this._instance;
    }

    static getPrismaClient() {
        if (!this._prismaClient) {
            this._prismaClient = new PrismaClient();
        }
        return this._prismaClient;
    }

    public useMiddleware(Middleware: Middleware) {
        Middleware.getMiddleware().forEach(m => {
            this.app.use(m);
        })
    }

    public useRouter(AppRouter: AppRouter) {
        const prefix = AppRouter.getPrefix();
        this.app.use('/api'.concat(prefix), AppRouter.getRouter());
    }

    public serve(path: string) {
        this.app.use(express.static(path))
    }

    public use(middleware: ExpressMiddleware) {
        this.app.use(middleware);
    }

    public listen(port = '4000') {
        this.app.listen(port, () => console.log(`🚀 Server ready at: http://localhost:${port}`));
    }
}

const prismaClient = App.getPrismaClient();
export const user = prismaClient.user;
export const todo = prismaClient.todo;

export default App.getApp();
