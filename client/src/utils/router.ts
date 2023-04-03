import { initTRPC } from '@trpc/server';
import * as z from 'zod';
import {
    getAllExplorations,
    getAllProjects,
    getBackground,
    getExplorationBySlug,
    getExplorationSlugs,
    getHomepageCards,
    getProjectBySlug,
    getProjectSlugs
} from './contentfulApi';
import {
    CONTENTFUL_BACKGROUND_PAGE,
    CONTENTFUL_EXPLORATION_PAGES,
    CONTENTFUL_PAGE_CARD,
    CONTENTFUL_PROJECT_PAGES,
    NULLABLE_CONTENTFUL_EXPLORATION_PAGE,
    NULLABLE_CONTENTFUL_PROJECT_PAGE,
    SITEMAP_SLUGS
} from './types';

export const trpc = initTRPC.create();

function logError(error: unknown) {
    const e = error instanceof z.ZodError ? JSON.stringify(error, null, 2) : error?.toString();
    console.error(e);
}

export const appRouter = trpc.router({
    homeCards: trpc.procedure
        .input(
            z
                .object({
                    preview: z.boolean()
                })
                .optional()
        )
        .output(CONTENTFUL_PAGE_CARD)
        .query(async ({ input }) => {
            try {
                const res = await getHomepageCards(input?.preview);
                return CONTENTFUL_PAGE_CARD.parse(res?.data?.homepageCardCollection?.items);
            } catch (error) {
                logError(error);
                return null;
            }
        }),
    backgroundInfo: trpc.procedure
        .input(
            z
                .object({
                    preview: z.boolean()
                })
                .optional()
        )
        .output(CONTENTFUL_BACKGROUND_PAGE)
        .query(async ({ input }) => {
            try {
                const res = await getBackground(input?.preview);
                return CONTENTFUL_BACKGROUND_PAGE.parse(res?.data?.background);
            } catch (error) {
                logError(error);
                return null;
            }
        }),
    explorations: trpc.procedure
        .input(
            z.object({
                page: z.number(),
                preview: z.boolean().optional()
            })
        )
        .output(
            z.object({ explorations: CONTENTFUL_EXPLORATION_PAGES, explorationCount: z.number() })
        )
        .query(async ({ input }) => {
            try {
                const res = await getAllExplorations(input.page, input?.preview);
                const explorations = CONTENTFUL_EXPLORATION_PAGES.parse(
                    res?.data?.explorationsCollection?.items
                );
                const explorationCount = res?.data?.explorationsCollection?.total ?? 0;

                return { explorations, explorationCount };
            } catch (error) {
                logError(error);
                return { explorations: null, explorationCount: 0 };
            }
        }),
    explorationPage: trpc.procedure
        .input(
            z.object({
                id: z.string().optional(),
                preview: z.boolean().optional()
            })
        )
        .output(NULLABLE_CONTENTFUL_EXPLORATION_PAGE)
        .query(async ({ input }) => {
            try {
                const res = await getExplorationBySlug(input?.id, input?.preview);
                return NULLABLE_CONTENTFUL_EXPLORATION_PAGE.parse(
                    res?.data?.explorationsCollection?.items[0]
                );
            } catch (error) {
                logError(error);
                return null;
            }
        }),
    explorationSitemap: trpc.procedure.output(SITEMAP_SLUGS).query(async () => {
        try {
            const res = await getExplorationSlugs();
            return SITEMAP_SLUGS.parse(res?.data?.explorationsCollection?.items);
        } catch (error) {
            logError(error);
            return [];
        }
    }),
    projects: trpc.procedure
        .input(
            z.object({
                page: z.number(),
                preview: z.boolean().optional()
            })
        )
        .output(z.object({ projects: CONTENTFUL_PROJECT_PAGES, projectCount: z.number() }))
        .query(async ({ input }) => {
            try {
                const res = await getAllProjects(input.page, input?.preview);
                const projects = CONTENTFUL_PROJECT_PAGES.parse(
                    res?.data?.projectsCollection?.items
                );
                const projectCount = res?.data?.projectsCollection?.total ?? 0;

                return { projects, projectCount };
            } catch (error) {
                logError(error);
                return { projects: null, projectCount: 0 };
            }
        }),
    projectPage: trpc.procedure
        .input(
            z.object({
                id: z.string().optional(),
                preview: z.boolean().optional()
            })
        )
        .output(NULLABLE_CONTENTFUL_PROJECT_PAGE)
        .query(async ({ input }) => {
            try {
                const res = await getProjectBySlug(input?.id, input?.preview);
                return NULLABLE_CONTENTFUL_PROJECT_PAGE.parse(
                    res?.data?.projectsCollection?.items[0]
                );
            } catch (error) {
                logError(error);
                return null;
            }
        }),
    projectSitemap: trpc.procedure.output(SITEMAP_SLUGS).query(async () => {
        try {
            const res = await getProjectSlugs();
            return SITEMAP_SLUGS.parse(res?.data?.projectsCollection?.items);
        } catch (error) {
            logError(error);
            return [];
        }
    })
});

export default appRouter;
