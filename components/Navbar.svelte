<script lang="ts">
	import { page } from '$app/stores'

	const pages = [
		{ name: 'Home', link: '/' },
		{ name: 'Levels', link: '/levels' }
	]

	$: current = $page.url.pathname
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

		& + & {
			margin-left: 1rem;
		}
	}

	[aria-current] {
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
</style>
