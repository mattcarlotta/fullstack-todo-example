import * as z from 'zod';
import type { Document } from '../types';

export const CONTENTFUL_DOCUMENT: z.ZodType<Document> = z.any();

export const CONTENTFUL_ID = z.object({
    sys: z.object({
        id: z.string()
    })
});

export const HeightAndWidth = z.object({
    height: z.number(),
    width: z.number()
});
export type THeightAndWidth = z.TypeOf<typeof HeightAndWidth>;

export const Title = z.object({
    title: z.string()
});

export const CONTENTFUL_IMAGE = HeightAndWidth.merge(Title).merge(
    z.object({
        contentType: z.string(),
        description: z.string(),
        url: z.string()
    })
);
export type TCONTENTFUL_IMAGE = z.TypeOf<typeof CONTENTFUL_IMAGE>;

export const CONTENTFUL_TITLE = Title;

export const CONTENTFUL_SLUG = z.object({
    slug: z.string()
});

export const CONTENTFUL_JSON = z.object({
    json: CONTENTFUL_DOCUMENT
});

export const CONTENTFUL_DESCRIPTION = z.object({
    description: CONTENTFUL_JSON
});

export const CONTENTFUL_PAGE_CARD = z
    .array(
        z
            .object({
                description: z.string(),
                imagePriority: z.boolean(),
                preview: CONTENTFUL_IMAGE
            })
            .merge(CONTENTFUL_ID)
            .merge(CONTENTFUL_TITLE)
            .merge(CONTENTFUL_SLUG)
    )
    .nullable();

export type HomePage = z.TypeOf<typeof CONTENTFUL_PAGE_CARD>;

export const CONTENTFUL_BACKGROUND_PAGE = z
    .object({
        profileImage: CONTENTFUL_IMAGE,
        location: z.string(),
        rank: z.string(),
        email: z.string(),
        tech: z.object({
            data: z.array(
                z.object({
                    level: z.number(),
                    technology: z.string()
                })
            )
        }),
        education: z.object({
            data: z.array(
                z.object({
                    url: z.string(),
                    title: z.string()
                })
            )
        })
    })
    .merge(CONTENTFUL_ID)
    .merge(CONTENTFUL_TITLE)
    .merge(CONTENTFUL_DESCRIPTION)
    .nullable();

export type BackgroundPage = z.TypeOf<typeof CONTENTFUL_BACKGROUND_PAGE>;
export type NonNullBackgroundPage = NonNullable<BackgroundPage>;

export const CONTENTFUL_PROJECT_PAGE = z
    .object({
        imagePriority: z.boolean(),
        seoDescription: z.string(),
        active: z.boolean(),
        status: z.string(),
        location: z.string().nullable(),
        source: z.string(),
        preview: CONTENTFUL_IMAGE,
        tech: z.array(z.string()),
        snapshotsCollection: z.object({
            items: z.array(CONTENTFUL_IMAGE)
        })
    })
    .merge(CONTENTFUL_ID)
    .merge(CONTENTFUL_TITLE)
    .merge(CONTENTFUL_DESCRIPTION)
    .merge(CONTENTFUL_SLUG);

export type ProjectPage = z.TypeOf<typeof CONTENTFUL_PROJECT_PAGE>;

export const NULLABLE_CONTENTFUL_PROJECT_PAGE = CONTENTFUL_PROJECT_PAGE.nullable();
export type NullProjectPage = z.TypeOf<typeof NULLABLE_CONTENTFUL_PROJECT_PAGE>;

export const CONTENTFUL_PROJECT_PAGES = z.array(CONTENTFUL_PROJECT_PAGE).nullable();
export type ProjectPages = z.TypeOf<typeof CONTENTFUL_PROJECT_PAGES>;

export const CONTENTFUL_EXPLORATION_PAGE = z
    .object({
        imagePriority: z.boolean().nullable(),
        sandboxId: z.string(),
        preview: CONTENTFUL_IMAGE
    })
    .merge(CONTENTFUL_ID)
    .merge(CONTENTFUL_TITLE)
    .merge(CONTENTFUL_SLUG);

export type ExplorationPage = z.TypeOf<typeof CONTENTFUL_EXPLORATION_PAGE>;

export const NULLABLE_CONTENTFUL_EXPLORATION_PAGE = CONTENTFUL_EXPLORATION_PAGE.nullable();
export type NullExplorationPage = z.TypeOf<typeof NULLABLE_CONTENTFUL_EXPLORATION_PAGE>;

export const CONTENTFUL_EXPLORATION_PAGES = z.array(CONTENTFUL_EXPLORATION_PAGE).nullable();
export type ExplorationPages = z.TypeOf<typeof CONTENTFUL_EXPLORATION_PAGES>;

export const SITEMAP_SLUGS = z.array(
    z.object({
        slug: z.string(),
        title: z.string()
    })
);
