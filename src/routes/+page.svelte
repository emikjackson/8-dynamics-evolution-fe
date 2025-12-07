<script>
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';
</script>

<main>
	<div class="logo-wrapper">
		<Logo />
	</div>
	<section>
		<h1 class="title">Welcome, Climate Wayfinder</h1>
		<p>
			<em
				>Note: An equivalent page (offers user the two actions) to this should be made on the
				Climate Wayfinding website.</em
			>
		</p>
		<p>
			Are you a Climate Wayfinding reader? You've made it to the right place to reflect with the 8
			Dynamics of Climate Engagement quiz.
		</p>

		<div class="links">
			<a href="/start" class="btn secondary">Take the Starting Point Quiz</a>
			<a href="/end" class="btn secondary">Take the Ending Point Quiz</a>
		</div>
	</section>
</main>

<style>
	.logo-wrapper {
		position: absolute;
		top: 0px;
		left: 0px;
	}
	main {
		background-color: var(--sky);
		padding: 3rem;
		height: 100vh;
		position: relative;
		box-sizing: border-box;
		grid-template-columns: 1fr minmax(400px, 1fr);
		grid-template-rows: min-content 1fr;
		gap: 1em 3em;
		background-image:
			url('$lib/assets/cloud-1.png'), url('$lib/assets/cloud-4.png'), url('$lib/assets/cloud-5.png');
		background-repeat: no-repeat, no-repeat, no-repeat;
		background-blend-mode: overlay, overlay, overlay;
		background-position:
			bottom left,
			bottom 0 right -100px,
			bottom right;
		background-size: 485px, 504px, 503px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	p {
		margin-top: 0px;
		margin-bottom: 40px;
		font-size: 1rem;
	}

	h1 {
		font-size: 72px;
		margin-top: 0px;
		margin-bottom: 25px;
	}

	.links {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
	}
</style>
