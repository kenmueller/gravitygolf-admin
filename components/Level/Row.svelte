<script lang="ts">
	import { page } from '$app/stores'

	import type Level from '$lib/level'
	import session from '$lib/session/store'
	import moveLoading from '$lib/level/move/loading'
	import focusedLevel from '$lib/level/focused'
	import selectedLevel from '$lib/level/selected'
	import errorFromResponse from '$lib/error/from/response'
	import Edit from '../../images/Edit.svelte'
	import Message from '../../images/Message.svelte'
	import Trash from '../../images/Trash.svelte'
	import Up from '../../images/Up.svelte'

	export let level: Level
	export let index: number
	export let lastIndex: number

	let editDataLoading = false

	const editData = () => {
		if (editDataLoading) return
		editDataLoading = true

		$selectedLevel = level.id
		window.location.hash = `#${level.id}`

		window.location.href = `https://grav.golf/levels/editor?publish=${encodeURIComponent(
			new URL(
				`/api/levels/${encodeURIComponent(level.id)}/data?value=`,
				$page.url.origin
			).href
		)}&data=${encodeURIComponent(JSON.stringify(level.data))}`
	}

	let editMessageLoading = false

	const editMessage = async () => {
		try {
			if (editMessageLoading) return
			editMessageLoading = true

			$selectedLevel = level.id
			window.location.hash = `#${level.id}`

			const message = prompt('Edit tooltip', level.message ?? '')
			if (message === null) return

			const response = await fetch(
				`/api/levels/${encodeURIComponent(level.id)}/message`,
				{
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(message || null)
				}
			)

			if (!response.ok) throw await errorFromResponse(response)
		} catch (error) {
			console.error(error)
			alert((error as Error).message)
		} finally {
			editMessageLoading = false
		}
	}

	let deleteLoading = false

	const deleteLevel = async () => {
		try {
			if (deleteLoading) return
			deleteLoading = true

			$selectedLevel = level.id
			window.location.hash = `#${level.id}`

			if (!confirm(`Are you sure you want to delete level ${index + 1}?`))
				return

			const response = await fetch(
				`/api/levels/${encodeURIComponent(level.id)}`,
				{ method: 'DELETE' }
			)

			if (!response.ok) throw await errorFromResponse(response)
		} catch (error) {
			console.error(error)
			alert((error as Error).message)
		} finally {
			deleteLoading = false
		}
	}

	const move = async (offset: -1 | 1) => {
		try {
			if ($moveLoading) return
			$moveLoading = true

			$selectedLevel = level.id
			window.location.hash = `#${level.id}`

			const response = await fetch(
				`/api/levels/${encodeURIComponent(level.id)}/move`,
				{
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(offset)
				}
			)

			if (!response.ok) throw await errorFromResponse(response)
		} catch (error) {
			console.error(error)
			alert((error as Error).message)
		} finally {
			$moveLoading = false
		}
	}
</script>

<div class="container">
	<article
		id={level.id}
		aria-selected={level.id === $focusedLevel || undefined}
	>
		<p class="id">{level.id}</p>
		<p class="name">Level {index + 1}</p>
		<button
			class="edit"
			aria-busy={editDataLoading || undefined}
			disabled={!$session.password}
			on:click={editData}
		>
			<Edit />
			Edit Level
		</button>
		<button
			class="edit"
			aria-busy={editMessageLoading || undefined}
			disabled={!$session.password}
			on:click={editMessage}
		>
			<Message />
			Edit Tooltip
		</button>
		<button
			class="delete"
			aria-busy={deleteLoading || undefined}
			disabled={!$session.password}
			on:click={deleteLevel}
		>
			<Trash />
		</button>
		<div class="move">
			<button
				class="up"
				aria-busy={$moveLoading || undefined}
				disabled={!$session.password || index <= 0}
				on:click={() => move(-1)}
			>
				<Up />
			</button>
			<button
				class="down"
				aria-busy={$moveLoading || undefined}
				disabled={!$session.password || index >= lastIndex}
				on:click={() => move(1)}
			>
				<Up />
			</button>
		</div>
	</article>
</div>

<style lang="scss">
	@use 'sass:math';

	.container {
		margin-bottom: 0.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid rgba(white, 0.1);
	}

	article {
		display: flex;
		align-items: center;
		color: white;
		border-radius: 0.3rem;
	}

	[aria-selected] {
		background: rgba(colors.$blue, 0.2);
	}

	.id {
		opacity: 0.5;
		text-align: right;
		width: 215px;
		overflow: hidden;
	}

	.name {
		margin: 0 auto 0 1rem;
	}

	.edit,
	.delete,
	.up,
	.down {
		transition: opacity 0.3s;

		&:hover {
			opacity: 0.7;
		}
	}

	[aria-busy],
	:disabled {
		pointer-events: none;
		opacity: 0.5;
	}

	.edit {
		display: flex;
		align-items: center;
		font-size: 0.9rem;
		color: colors.$blue;

		& + & {
			margin-left: 1.3rem;
		}

		> :global(svg) {
			height: 1.4rem;
			margin-right: 0.4rem;
		}
	}

	.delete {
		margin-left: 1rem;
		color: colors.$red;

		> :global(svg) {
			height: 1.8rem;
		}
	}

	.move {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-left: 1rem;
	}

	.up,
	.down {
		padding: 0.4rem 0.3rem;
		color: white;
		background: rgba(white, 0.1);
		border-radius: 0.3rem;

		> :global(svg) {
			height: 0.6rem;
		}
	}

	.down {
		margin-top: 0.3rem;

		> :global(svg) {
			transform: rotate(0.5turn);
		}
	}
</style>
