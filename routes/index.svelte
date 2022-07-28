<script lang="ts">
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'

	import Up from '../images/Up.svelte'
</script>

<MetaImage />
<MetaTitle />
<MetaDescription />

<main>
	<h1><span>Manage</span> Gravity Golf</h1>
	<a href="/levels">
		Levels
		<Up />
	</a>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem 1.5rem;
	}

	h1 {
		font-size: 3rem;
		color: white;
	}

	span {
		color: colors.$blue;
	}

	a {
		display: flex;
		align-items: center;
		margin-top: 2rem;
		font-size: 2rem;
		color: colors.$blue;

		&:hover {
			text-decoration: underline;

			> :global(svg) {
				transform: rotate(0.25turn) translateY(-0.5rem);
			}
		}

		> :global(svg) {
			height: 1rem;
			margin-left: 1rem;
			transform: rotate(0.25turn);
			transition: transform 0.3s;
		}
	}
</style>
