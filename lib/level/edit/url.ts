import type Level from '..'
import replaceWithRounded from '$lib/replaceWithRounded'

export interface EditLevelUrlOptions {
	origin: string
	index: number
	level: Level
}

const editLevelUrl = ({ origin, index, level }: EditLevelUrlOptions) =>
	new URL(
		`/levels/editor?name=${encodeURIComponent(
			`Level ${index + 1}`
		)}&publish=${encodeURIComponent(
			new URL(`/api/levels/${encodeURIComponent(level.id)}/data?value=`, origin)
				.href
		)}&data=${encodeURIComponent(
			JSON.stringify(level.data, replaceWithRounded(2))
		)}`,
		import.meta.env.VITE_MAIN_ORIGIN
	)

export default editLevelUrl
