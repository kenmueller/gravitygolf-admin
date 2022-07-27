<script context="module" lang="ts">
	export const load: Load = async ({ fetch }) => {
		try {
			const response = await fetch('/api/levels')
			if (!response.ok) throw await errorFromResponse(response)

			return {
				props: { initialLevels: await response.json() }
			}
		} catch (value) {
			const { code, message } = errorFromValue(value)
			return { status: code, error: message }
		}
	}
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'

	import type Level from '$lib/level'
	import levels from '$lib/levels'
	import errorFromResponse from '$lib/error/from/response'
	import errorFromValue from '$lib/error/from/value'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
	import LevelRow from '../components/Level/Row.svelte'

	export let initialLevels: Level[]

	$: currentLevels = $levels ?? initialLevels
</script>

<MetaImage />
<MetaTitle value="Levels | Gravity Golf Admin" />
<MetaDescription value="Levels | Gravity Golf Admin" />

<main>
	{#each currentLevels as level, index (level.id)}
		<LevelRow {level} {index} maxIndex={currentLevels.length - 1} />
	{/each}
</main>

<style lang="scss">
	main {
		overflow-y: auto;
		padding: 0.5rem 1.5rem;
	}
</style>
