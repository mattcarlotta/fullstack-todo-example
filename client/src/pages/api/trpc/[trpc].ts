import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { APIRoute } from 'astro';
import router from '../../../utils/router';

export const all: APIRoute = ({ request }) => {
    return fetchRequestHandler({
        req: request,
        endpoint: '/api/trpc',
        router,
        createContext: () => Promise.resolve(null)
    });
};

export type AppRouter = typeof router;

export const caller = router.createCaller({});
