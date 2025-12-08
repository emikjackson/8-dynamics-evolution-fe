<script lang="ts">
	import dynamics, { rotateDynamic } from '$lib/dynamics';
	import Arrow from './Arrow.svelte';

	let {
		highlight = 0,
		startAnswers,
		endAnswers,
		onHover,
		onLeave
	}: {
		highlight: number;
		startAnswers: string[];
		endAnswers: string[];
		onHover: CallableFunction;
		onLeave: CallableFunction;
	} = $props();

	function onArrowClick(delta: number) {
		const selected = rotateDynamic(highlight, delta);
		onHover(selected);
	}
</script>

<div class="mobile">
	<div class="interactive">
		<Arrow direction="left" onClick={() => onArrowClick(-1)} />
		{highlight + 1}
		<Arrow direction="right" onClick={() => onArrowClick(1)} />
	</div>
	<p>
		{dynamics[highlight].full}
		<span class="visually-hidden"
			>Your Shift: {startAnswers[highlight]} to {endAnswers[highlight]}</span
		>
	</p>
</div>
<!-- non-mobile -->
<ol>
	<li>
		<div>Dynamic</div>
		<div class="results">
			<span class="s">Start</span>
			<span class="arrow"></span>
			<span class="e">End</span>
		</div>
		<!-- <span class="visually-hidden">Your Shift: {startAnswers[idx]} to {endAnswers[highlight]}</span> -->
	</li>
	{#each dynamics as dynamic, idx}
		<li>
			<div>
				<span class="index">{idx + 1}.</span>
				{dynamic.full}
			</div>
			<div class="results">
				<span class="s">{startAnswers[idx]}</span>
				<span class="arrow">⟶</span>
				<span class="c">{endAnswers[idx]}</span>
			</div>
			<!-- <span class="visually-hidden">Your Shift: {startAnswers[idx]} to {endAnswers[highlight]}</span> -->
		</li>
	{/each}
</ol>

<style>
	.mobile {
		font-size: 24px;
		text-align: center;
		font-weight: 600;
		margin: 2em 0;
	}
	.mobile div {
		display: flex;
		justify-content: center;
		gap: 20px;
		margin: 0.5em auto;
	}
	.mobile p {
		font-size: 16px;
		line-height: 1.4;
		max-width: 300px;
		margin: 0 auto;
	}
	ol {
		display: none;
		padding: 0 1.4em;
		width: var(--width-large);
	}
	ol li {
		margin-bottom: 1em;
		display: flex;
		justify-content: space-between;
		font-size: 1rem;
	}
	ol li:first-child {
		font-family: 'adobe-garamond-pro', serif;
		font-size: 20px;
	}
	.index {
		margin-right: 2px;
	}
	.results {
		display: flex;
		gap: 2px;
		align-items: center;
	}
	.arrow,
	.s,
	.c {
		display: block;
		width: 30px;
		text-align: center;
	}
	.arrow {
		font-size: 1rem;
		width: 50px;
	}
	@media screen and (min-width: 900px) {
		.mobile {
			display: none;
		}
		ol {
			display: block;
		}
	}
</style>
