<script lang="ts">
	import '@fontsource/poppins';

	import favicon from '$lib/assets/favicon.svg';
	import '../app.css'

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
	{@render children()}
</div>

<style>
	.container {
		max-width: 70em;
		margin: auto;
	}
</style>

