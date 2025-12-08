<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ButtonLoader from '$lib/components/ButtonLoader.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { delay } from '$lib/helpers/general';
	import { _checkStartCode } from './+page';

	// Code form & state management
	let code = $state('');
	let codeCheckLoading = $state<boolean>(false);
	let codeCheckFinished = $state<boolean>(false);
	let codeCheckSuccess = $state<boolean>(false);
	let codeError = $state<string>('');

	function preventExtensiveLength(event: KeyboardEvent) {
		// Allow deleting and navigating
		if (
			event.key === 'Backspace' ||
			event.key === 'Delete' ||
			event.key === 'Tab' ||
			event.key.startsWith('Arrow') ||
			event.ctrlKey ||
			event.metaKey
		) {
			return;
		}
		if (event.target?.value?.length > 5) {
			event.preventDefault(); // Stop the character from being entered
		}
	}

	function handleCodeInputChange(evt: Event): void {
		const input = evt.target as HTMLInputElement;
		if (/^[0-9]+$/.test(input.value) && input.value.length <= 6) {
			code = input.value;
		}
	}

	const handleContinue = $derived(() => {
		goto(`/end/${code}`);
	});
</script>

<div class="wrapper">
	<header class="logo">
		<Logo />
	</header>
	<main>
		<section>
			<div class="column">
				{#if codeCheckSuccess}
					<h1 class="title">Got it!</h1>
					<p style="margin-bottom:40px;">
						Amazing, we've got your starting point results. Let's jump into the 8 Dynamics of
						Climate Engagement, round two. On the next page, we'll ask you to fill out your 8
						Dynamics of Climate Engagement again, reflecting on how you feel today.
					</p>
					<div class="buttons">
						<button class="btn primary" onclick={handleContinue} type="button">Let's Go</button>
					</div>
				{:else}
					<h1 class="title">Add Your Starting Point Code</h1>
					<p>
						You may have it written down or saved it digitally! If you emailed it to yourself with
						our website, check for an email with the subject “Your 8 Dynamics Code”
					</p>
					{#if codeError.length > 0}
						<p class="error">{codeError}</p>
					{/if}
					<!-- data-sveltekit-noscroll -->
					<!-- use:enhance -->
					<form
						onsubmit={async (e) => {
							if (code === '' || code.length < 6) {
								codeError = 'Please enter a six-digit code';
								return;
							}
							codeCheckLoading = true;
							await delay(1000);
							const resp = await _checkStartCode(code);
							if (resp.success) {
								codeCheckSuccess = true;
							} else if (resp.notFound) {
								codeError =
									"We couldn't find a matching entry with that code. Please double check your entry.";
							} else {
								codeError =
									'Having trouble identifying that code, please refresh your page and try again.';
							}
							codeCheckLoading = false;
						}}
					>
						<label
							><span>Your Starting Point Code</span>
							<input
								value={code}
								type="number"
								placeholder="______"
								oninput={handleCodeInputChange}
								onkeydown={preventExtensiveLength}
								id="code"
							/>
						</label>
						<div class="buttons">
							<button class="btn primary" class:loading={codeCheckLoading} type="submit">
								{#if codeCheckLoading}
									<ButtonLoader />
								{:else}
									Submit
								{/if}
							</button>
						</div>
					</form>

					<p class="note">
						Don't have the code? No worries, although you won't be able to compare your results, you
						can still take the quiz! <a href="/end/skipstart">Skip to Quiz</a>
					</p>
				{/if}
			</div>
		</section>
	</main>
	<!-- <footer>
		© 2024 The All We Can Save Project. Developers <a
			href="https://github.com/chelshaw"
			target="_blank"
			rel="noopener nofollow">Chelsea Shaw</a
		>,
		<a href="https://github.com/emikjackson" target="_blank" rel="noopener nofollow">Emi Jackson</a
		>, and
		<a href="https://www.linkedin.com/in/li-helen" target="_blank" rel="noopener nofollow"
			>Helen Li</a
		> brought this interactive tool to life.
	</footer> -->
</div>

<style>
	button {
		min-width: 200px;
	}
	.logo {
		height: 120px;
		position: relative;
		margin-bottom: 40px;
	}
	.wrapper {
		background-color: var(--sky);
		min-height: 100vh;
		box-sizing: border-box;
		background-color: var(--sky);
		background-image:
			url('$lib/assets/cloud-1.png'), url('$lib/assets/cloud-4.png'), url('$lib/assets/cloud-5.png');
		background-repeat: no-repeat, no-repeat, no-repeat;
		background-blend-mode: overlay, overlay, overlay;
		background-position:
			bottom left,
			bottom 0 right -100px,
			bottom right;
		background-size: 485px, 504px, 503px;
		padding: 20px 20px;
	}

	section {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 60vh;
	}

	.column {
		display: flex;
		width: var(--width-medium);
		justify-content: center;
		text-align: center;
		flex-direction: column;
	}

	.column p {
		font-size: 1rem;
	}

	label > span {
		margin-top: 20px;
		display: block;
		margin-bottom: 10px;
		font-size: 1rem;
	}

	input {
		padding: 10px;
		padding-bottom: 16px;
		width: 300px;
		font-size: 2.5rem;
		font-family: 'General Grotesque', Helvetica, Arial, sans-serif;
		font-weight: 200;
		color: var(--charcoal);
		background-color: var(--cream);
		border-radius: 10px;
		border: none;
		cursor: pointer;
		letter-spacing: 10px;
		text-align: center;
		margin-bottom: 20px;
	}

	form {
		margin-bottom: 40px;
	}

	.note {
		font-style: italic;
	}

	/* Hide little arrows on numeric field */
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	/* For Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield; /* Standard property */
	}

	/* @media screen and (max-width: 400px) {
		.clouds {
			padding: 10px;
			padding-bottom: 20px;
		}
	} */
</style>
