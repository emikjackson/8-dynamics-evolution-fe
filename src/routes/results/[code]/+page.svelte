<script lang="ts">
	import FullEndResults from './FullEndResults.svelte';
	import SingleEndResults from './SingleEndResults.svelte';
	import StartingPointResults from './StartingPointResults.svelte';

	let { data } = $props();
</script>

{#if data.current?.isStart}
	<StartingPointResults {data} />
{:else if data.start}
	<FullEndResults {data} />
{:else}
	<SingleEndResults {data} />
{/if}
