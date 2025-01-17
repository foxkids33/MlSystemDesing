/// <reference types="vitest" />
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://api-stage.csai.site',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''), // Remove the `/api` prefix
			},
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
	},
});
