import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
    plugins: [react()],
    root: __dirname,
    resolve: {
        alias: {
            '@uuv/dictionary': path.resolve(
                __dirname,
                '../dictionary/src/index.ts'
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