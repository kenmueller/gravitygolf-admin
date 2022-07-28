<script lang="ts">
	import { page } from '$app/stores'
	import errorFromResponse from '$lib/error/from/response'

	import session from '$lib/session/store'

	const pages = [
		{ name: 'Home', link: '/' },
		{ name: 'Levels', link: '/levels' }
	]

	$: current = $page.url.pathname

	let password = ''
	let passwordLoading = false

	const savePassword = async () => {
		try {
			if (!password || passwordLoading) return
			passwordLoading = true

			const response = await fetch('/api/password', {
				method: 'POST',
				body: password
			})

			if (!response.ok) throw await errorFromResponse(response)

			session.set({ ...session, password: true })
			password = ''
		} catch (error) {
			console.error(error)
			alert((error as Error).message)
		} finally {
			passwordLoading = false
		}
	}
</script>

<nav>
	<a class="home" href="/">
		Gravity Golf <span>Admin</span>
	</a>
	{#each pages as { name, link } (link)}
		<a
			class="page"
			href={link}
			aria-current={link === current ? 'page' : undefined}
		>
			{name}
		</a>
	{/each}
	<form on:submit|preventDefault={savePassword}>
		<input
			type="password"
			placeholder="{$session.password ? 'Change' : 'Enter'} password"
			bind:value={password}
		/>
		<button aria-busy={passwordLoading || undefined} disabled={!password}>
			Save
		</button>
	</form>
</nav>

<style lang="scss">
	@use 'sass:math';

	nav {
		display: flex;
		align-items: center;
		margin: 0 1.5rem;
		padding: 1rem 0;
		border-bottom: 1px solid rgba(white, 0.1);
	}

	.home {
		margin-right: auto;
		font-size: 1.5rem;
		color: white;
	}

	span {
		color: colors.$blue;
	}

	.page {
		position: relative;
		color: white;
		transition: opacity 0.3s;

		&:hover {
			opacity: 0.7;
		}

		& + & {
			margin-left: 1rem;
		}
	}

	[aria-current] {
		pointer-events: none;
		color: colors.$blue;

		&::after {
			$height: 2px;

			content: '';
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			height: $height;
			background: currentColor;
			border-radius: math.div($height, 2);
		}
	}

	form {
		display: flex;
		align-items: stretch;
		margin-left: auto;
	}

	input {
		padding: 0.3rem 0.7rem;
		font-size: 0.9rem;
		color: white;
		background: rgba(white, 0.1);
		border-radius: 0.5rem;

		&::placeholder {
			color: rgba(white, 0.5);
		}
	}

	button {
		margin-left: 0.5rem;
		padding: 0 0.8rem;
		font-size: 0.9rem;
		color: white;
		background: colors.$blue;
		border-radius: 0.5rem;
		transition: opacity 0.3s;

		&:hover {
			opacity: 0.7;
		}

		&[aria-busy],
		&:disabled {
			pointer-events: none;
			opacity: 0.5;
		}
	}
</style>
