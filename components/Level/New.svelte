<script lang="ts">
	import session from '$lib/session/store'
	import selectedLevel from '$lib/level/selected'
	import errorFromResponse from '$lib/error/from/response'

	import Plus from '../../images/Plus.svelte'

	let loading = false

	const newLevel = async () => {
		try {
			if (loading) return
			loading = true

			const response = await fetch('/api/levels', { method: 'POST' })
			if (!response.ok) throw await errorFromResponse(response)

			const id = await response.text()

			$selectedLevel = id
			location.hash = `#${id}`
		} catch (error) {
			console.error(error)
			alert((error as Error).message)
		} finally {
			loading = false
		}
	}
</script>

<button
	aria-busy={loading || undefined}
	disabled={!$session.password}
	on:click={newLevel}
>
	<Plus />
	New Level
</button>

<style lang="scss">
	button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 1rem 0;
		white-space: nowrap;
		font-size: 1.3rem;
		color: colors.$blue;
		transition: opacity 0.3s;

		&:hover {
			opacity: 0.7;
		}

		> :global(svg) {
			height: 1.8rem;
			margin-right: 1rem;
		}
	}

	[aria-busy],
	:disabled {
		pointer-events: none;
		opacity: 0.5;
	}
</style>
