<script lang="ts">
	import MetaBase from '../components/Meta/Base.svelte'
	import Layout from '../components/Layout.svelte'
</script>

<svelte:head>
	<link
		rel="preconnect"
		href="https://fonts.googleapis.com"
		crossorigin="anonymous"
	/>
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Kdam+Thmor+Pro&display=swap"
		crossorigin="anonymous"
	/>
</svelte:head>

<MetaBase />

<Layout>
	<slot />
</Layout>

<style lang="scss" global>
	*,
	::before,
	::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		font-family: font.$family;
		border: none;
		outline: none;
	}

	html,
	body {
		height: 100%;
	}

	body {
		overflow: hidden;
		background: colors.$gray;
	}

	a {
		text-decoration: none;
	}

	button {
		cursor: pointer;
		background: none;

		&:disabled {
			cursor: default;
		}
	}

	svg {
		display: block;
	}
</style>
