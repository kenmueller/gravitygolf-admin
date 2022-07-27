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
	import errorFromResponse from '$lib/error/from/response'
	import errorFromValue from '$lib/error/from/value'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
	import levels from '$lib/levels'

	export let initialLevels: Level[]
</script>

<MetaImage />
<MetaTitle value="Levels | Gravity Golf Admin" />
<MetaDescription value="Levels | Gravity Golf Admin" />

<main>
	{#each $levels ?? initialLevels as level (level.id)}
		<p>{JSON.stringify(level)}</p>
	{/each}
</main>

<style lang="scss">
</style>
