import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        react({
            
        })
    ],
    build: {
        emptyOutDir: false,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'rd-component',
            formats: ['es','umd'],
            fileName: (format) => `rd-component.${format}.js`
        },
        assetsDir: 'src/assets',
        sourcemap: true,
        rollupOptions: {
            external: ['react', 'react-dom', 'styled-components','react-router-dom','react-redux','redux','react/jsx-runtime'],
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


