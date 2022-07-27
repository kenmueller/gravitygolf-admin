<script lang="ts">
	import type Level from '$lib/level'
	import moveLoading from '$lib/level/move/loading'
	import focusedLevel from '$lib/level/focused'
	import selectedLevel from '$lib/level/selected'
	import errorFromResponse from '$lib/error/from/response'
	import Edit from '../../images/Edit.svelte'
	import Trash from '../../images/Trash.svelte'
	import Up from '../../images/Up.svelte'

	export let level: Level
	export let index: number
	export let lastIndex: number

	let deleteLoading = false

	const deleteLevel = async () => {
		try {
			if (deleteLoading) return

			if (!confirm(`Are you sure you want to delete level ${index + 1}?`))
				return

			deleteLoading = true

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
		<button class="edit">
			<Edit />
			<span>Edit</span>
		</button>
		<button
			class="delete"
			aria-busy={deleteLoading || undefined}
			on:click={deleteLevel}
		>
			<Trash />
		</button>
		<div class="move">
			<button
				class="up"
				aria-busy={$moveLoading || undefined}
				disabled={index <= 0}
				on:click={() => move(-1)}
			>
				<Up />
			</button>
			<button
				class="down"
				aria-busy={$moveLoading || undefined}
				disabled={index >= lastIndex}
				on:click={() => move(1)}
			>
				<Up />
			</button>
		</div>
	</article>
</div>

<style lang="scss">
	@use 'sass:math';

	.container + :global(.container) {
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid rgba(white, 0.1);
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

		> :global(svg) {
			height: 1.4rem;
		}

		> span {
			margin-left: 0.4rem;
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
