/// <reference types="astro/client" />
/* eslint-disable */
interface ImportMetaEnv {
    readonly CONTENTFUL_BASE_URL: string;
    readonly CONTENTFUL_SPACE_ID: string;
    readonly CONTENTFUL_BACKGROUND_ID: string;
    readonly CONTENTFUL_ACCESS_TOKEN: string;
    readonly CONTENTFUL_PREVIEW_ACCESS_TOKEN: string;
    readonly HOST: string;
    readonly PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
