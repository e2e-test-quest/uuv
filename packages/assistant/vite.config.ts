import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
    plugins: [react()],
    root: __dirname,
    resolve: {
        alias: {
            '@uuv/runner-commons/wording/web/en': path.resolve(
                __dirname,
                '../runner-commons/src/assets/i18n/web/en/index.ts'
            ),
        },
    },
    build: {
        manifest: true,
        rollupOptions: {
            input: path.resolve(__dirname, "index.html"),
        },
        outDir: "build",
    },
});