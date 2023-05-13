import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            
        }),
        dts({
            insertTypesEntry: true,
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'rd-component',
            formats: ['es','umd'],
            fileName: (format) => `rd-component.${format}.js`
        },
        assetsDir: 'src/assets',
        sourcemap: true,
        rollupOptions: {
            external: ['react', 'react-dom', 'styled-components','react-router-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'styled-components': 'styled',
                }
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})


