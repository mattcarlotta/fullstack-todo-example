import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    outDir: './dist',
    integrations: [tailwind(), solid()],
    adapter: node({
        mode: 'middleware'
    }),
    server: { port: 3000 }
});
