<script lang="ts">
	import Navbar from './Navbar.svelte'
</script>

<div>
	<Navbar />
	<slot />
</div>

<style lang="scss">
	div {
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100%;
	}
</style>
