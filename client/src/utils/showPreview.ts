export function showPreview(preview?: string | null) {
    return preview === import.meta.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
}
