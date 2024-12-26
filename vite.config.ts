import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['pdfjs-dist'] // Excluye pdfjs-dist para evitar problemas con el worker
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					pdfjs: ['pdfjs-dist'] // Manejo separado de pdf.js para reducir errores
				}
			}
		}
	}
});
