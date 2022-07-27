/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'
import autoprefixer from 'autoprefixer'

const styles = ['colors', 'font']

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: {
			plugins: [autoprefixer()]
		},
		scss: {
			prependData: styles.map(path => `@use 'styles/${path}';`).join('')
		}
	}),
	compilerOptions: {
		immutable: true
	},
	kit: {
		adapter: adapter(),
		files: {
			assets: 'public',
			hooks: 'hooks',
			lib: 'lib',
			routes: 'routes',
			serviceWorker: 'lib/worker',
			template: 'lib/index.html'
		},
		csp: {
			directives: {
				'base-uri': ['self'],
				'default-src': ['self'],
				'connect-src': [
					'self',
					'https://firestore.googleapis.com',
					'https://firestore.googleapis.com'
				],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com']
			}
		}
	}
}

export default config
