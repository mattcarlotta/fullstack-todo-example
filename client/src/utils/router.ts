import { initTRPC } from '@trpc/server';
import * as z from 'zod';
import { fetchDELETE, fetchGET, fetchPOST, fetchPUT } from './fetchAPI';
import {
    Id,
    Message,
    RespError,
    TodosList,
    TODOS,
    Token,
    CREATE_TODO,
    EDIT_TODO,
} from 'types';

export const trpc = initTRPC.create();

function logError(error: unknown) {
    const e = error instanceof z.ZodError ? error?.message : error?.toString();
    console.error(e);
    return e;
}

const appRouter = trpc.router({
    getTodos: trpc.procedure
        .input(Token)
        .output(TodosList.merge(RespError))
        .query(async ({ input }) => {
            try {
                const data = await fetchGET({
                    url: '/todo/all',
                    headers: { cookie: `SESSION_TOKEN=${input.token}` }
                });
                const todos = TODOS.parse(data);
                return { todos, error: '' };
            } catch (error) {
                const e = logError(error);
                return { todos: [], error: e };
            }
        }),
    createTodo: trpc.procedure
        .input(CREATE_TODO.merge(Token))
        .output(TodosList.merge(Message).merge(RespError))
        .query(async ({ input }) => {
            try {
                const data = await fetchPOST({
                    url: `/todo/create`,
                    body: { ...input },
                    headers: {
                        'Content-Type': 'application/json',
                        cookie: `SESSION_TOKEN=${input.token}`
                    }
                });
                const result = TodosList.merge(Message).parse(data);
                return { ...result, error: '' };
            } catch (error) {
                const e = logError(error);
                throw e;
            }
        }),
    deleteTodo: trpc.procedure
        .input(Id.merge(Token))
        .output(Id.merge(Message).merge(RespError))
        .query(async ({ input }) => {
            try {
                const data = await fetchDELETE({
                    url: `/todo/delete/${input.id}`,
                    headers: { cookie: `SESSION_TOKEN=${input.token}` }
                });
                const result = Id.merge(Message).parse(data);
                return { ...result, error: '' };
            } catch (error) {
                const e = logError(error);
                throw e;
            }
        }),
    completeTodo: trpc.procedure
        .input(Id.merge(Token))
        .output(TodosList.merge(Message).merge(RespError))
        .query(async ({ input }) => {
            try {
                const data = await fetchPUT({
                    url: `/todo/complete/${input.id}`,
                    body: { ...input },
                    headers: {
                        'Content-Type': 'application/json',
                        cookie: `SESSION_TOKEN=${input.token}`
                    }
                });
                const result = TodosList.merge(Message).parse(data);
                return { ...result, error: '' };
            } catch (error) {
                const e = logError(error);
                throw e;
            }
        }),
    updateTodo: trpc.procedure
        .input(Id.merge(EDIT_TODO).merge(Token))
        .output(TodosList.merge(Message).merge(RespError))
        .query(async ({ input }) => {
            try {
                const data = await fetchPUT({
                    url: `/todo/update/${input.id}`,
                    body: { ...input },
                    headers: {
                        'Content-Type': 'application/json',
                        cookie: `SESSION_TOKEN=${input.token}`
                    }
                });
                const result = TodosList.merge(Message).parse(data);
                return { ...result, error: '' };
            } catch (error) {
                const e = logError(error);
                throw e;
            }
        })
    // backgroundInfo: trpc.procedure
    //     .input(
    //         z
    //             .object({
    //                 preview: z.boolean()
    //             })
    //             .optional()
    //     )
    //     .output(CONTENTFUL_BACKGROUND_PAGE)
    //     .query(async ({ input }) => {
    //         try {
    //             const res = await getBackground(input?.preview);
    //             return CONTENTFUL_BACKGROUND_PAGE.parse(res?.data?.background);
    //         } catch (error) {
    //             logError(error);
    //             return null;
    //         }
    //     }),
    // explorations: trpc.procedure
    //     .input(
    //         z.object({
    //             page: z.number(),
    //             preview: z.boolean().optional()
    //         })
    //     )
    //     .output(
    //         z.object({ explorations: CONTENTFUL_EXPLORATION_PAGES, explorationCount: z.number() })
    //     )
    //     .query(async ({ input }) => {
    //         try {
    //             const res = await getAllExplorations(input.page, input?.preview);
    //             const explorations = CONTENTFUL_EXPLORATION_PAGES.parse(
    //                 res?.data?.explorationsCollection?.items
    //             );
    //             const explorationCount = res?.data?.explorationsCollection?.total ?? 0;

    //             return { explorations, explorationCount };
    //         } catch (error) {
    //             logError(error);
    //             return { explorations: null, explorationCount: 0 };
    //         }
    //     }),
    // explorationPage: trpc.procedure
    //     .input(
    //         z.object({
    //             id: z.string().optional(),
    //             preview: z.boolean().optional()
    //         })
    //     )
    //     .output(NULLABLE_CONTENTFUL_EXPLORATION_PAGE)
    //     .query(async ({ input }) => {
    //         try {
    //             const res = await getExplorationBySlug(input?.id, input?.preview);
    //             return NULLABLE_CONTENTFUL_EXPLORATION_PAGE.parse(
    //                 res?.data?.explorationsCollection?.items[0]
    //             );
    //         } catch (error) {
    //             logError(error);
    //             return null;
    //         }
    //     }),
    // explorationSitemap: trpc.procedure.output(SITEMAP_SLUGS).query(async () => {
    //     try {
    //         const res = await getExplorationSlugs();
    //         return SITEMAP_SLUGS.parse(res?.data?.explorationsCollection?.items);
    //     } catch (error) {
    //         logError(error);
    //         return [];
    //     }
    // }),
    // projects: trpc.procedure
    //     .input(
    //         z.object({
    //             page: z.number(),
    //             preview: z.boolean().optional()
    //         })
    //     )
    //     .output(z.object({ projects: CONTENTFUL_PROJECT_PAGES, projectCount: z.number() }))
    //     .query(async ({ input }) => {
    //         try {
    //             const res = await getAllProjects(input.page, input?.preview);
    //             const projects = CONTENTFUL_PROJECT_PAGES.parse(
    //                 res?.data?.projectsCollection?.items
    //             );
    //             const projectCount = res?.data?.projectsCollection?.total ?? 0;

    //             return { projects, projectCount };
    //         } catch (error) {
    //             logError(error);
    //             return { projects: null, projectCount: 0 };
    //         }
    //     }),
    // projectPage: trpc.procedure
    //     .input(
    //         z.object({
    //             id: z.string().optional(),
    //             preview: z.boolean().optional()
    //         })
    //     )
    //     .output(NULLABLE_CONTENTFUL_PROJECT_PAGE)
    //     .query(async ({ input }) => {
    //         try {
    //             const res = await getProjectBySlug(input?.id, input?.preview);
    //             return NULLABLE_CONTENTFUL_PROJECT_PAGE.parse(
    //                 res?.data?.projectsCollection?.items[0]
    //             );
    //         } catch (error) {
    //             logError(error);
    //             return null;
    //         }
    //     }),
    // projectSitemap: trpc.procedure.output(SITEMAP_SLUGS).query(async () => {
    //     try {
    //         const res = await getProjectSlugs();
    //         return SITEMAP_SLUGS.parse(res?.data?.projectsCollection?.items);
    //     } catch (error) {
    //         logError(error);
    //         return [];
    //     }
    // })
});

export default appRouter;
