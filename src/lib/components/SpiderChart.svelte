<script lang="ts">
	import { line, scaleLinear } from 'd3';
	import { onDestroy, onMount } from 'svelte';
	let {
		answers,
		startAnswers,
		highlight,
		chartWidth,
		onHover,
		onLeave,
		isStart,
		skipHover,
		isOverlay,
		showHighlight
	}: {
		answers: Record<string, number>;
		startAnswers?: Record<string, number>;
		highlight: number;
		chartWidth: number;
		onHover: CallableFunction;
		onLeave: CallableFunction;
		isStart?: Boolean;
		skipHover?: Boolean;
		isOverlay?: Boolean;
		showHighlight?: Boolean;
	} = $props();

	let useStartData = $state(true);
	const features = $derived(Object.keys(answers));
	let intervalId = $state<number>();
	let firstRunComplete = $state(false);

	console.log('ANSWERS?', answers);

	function startRotate() {
		if (startAnswers) {
			intervalId = setInterval(() => {
				if (!firstRunComplete) {
					firstRunComplete = true;
				}
				useStartData = !useStartData;
			}, 3000);
		}
	}

	function stopRotate() {
		clearInterval(intervalId);
		intervalId = undefined;
	}

	onMount(() => {
		startRotate();
	});
	onDestroy(() => {
		stopRotate();
	});

	const config = $derived({
		d: chartWidth, // diameter of chart
		labelRadius: 14, // radius of label circles
		ticks: [1, 2, 3, 4, 5]
	});

	let radialScale = $derived(
		scaleLinear()
			// domain includes labels position
			.domain([0, 6.5])
			.range([0, config.d / 2])
	);

	let lineHelper = line()
		.x((d: [number, number]) => d[0])
		.y((d: [number, number]) => d[1]);

	// given the precise angle in radians and value (1-5),
	// returns {x, y} coordinate with padding accounted for
	function angleToCoordinate(angle: number, value: number) {
		// multiplying by -1 makes the math count clockwise
		let x = Math.cos(angle) * radialScale(value) * -1;
		let y = Math.sin(angle) * radialScale(value);
		return { x: config.d / 2 + x, y: config.d / 2 - y };
	}

	// Method for drawing non-circle tick mark
	// `tick` maps to range values 1-5 per question
	// `tickToPolygon` draws the concentric octagons
	function tickToPolygon(tick: number) {
		const numbers = features
			.map((f, i) => {
				let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
				return angleToCoordinate(angle, tick);
			})
			.reduce((prev, curr) => {
				return `${prev} ${curr.x} ${curr.y}`;
			}, '')
			.trim();
		return numbers;
	}

	// `radialTickLines` calculates the lines from center of the octagons to create the web
	const radialTickLines = $derived.by(() => {
		let lines: { outerX: number; outerY: number; labelX: number; labelY: number }[] = [];
		for (var i = 0; i < features.length; i++) {
			let pct = i / features.length;
			let angle = Math.PI / 2 + 2 * Math.PI * pct;
			const { x, y } = angleToCoordinate(angle, 5);
			const lCoord = angleToCoordinate(angle, 6);
			lines.push({
				outerX: x,
				outerY: y,
				labelX: lCoord.x,
				labelY: lCoord.y
			});
		}
		return lines;
	});

	function drawAnswerShape(answers: Record<string, number>): string | null {
		let coordinates: [number, number][] = [];
		for (var i = 0; i < features.length; i++) {
			let ft_name = features[i];
			let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
			let { x, y } = angleToCoordinate(angle, answers[ft_name]);
			coordinates.push([x, y]);
		}
		return lineHelper(coordinates);
	}

	// draws circles for score labels
	function getCircleCoords({ answer, idx }: { answer: number; idx: number }) {
		let angle = Math.PI / 2 + (2 * Math.PI * idx) / features.length;
		return {
			...angleToCoordinate(angle, answer),
			answer
		};
	}
	const formattedAnswers = $derived(
		features.reduce(
			(
				resultArray: {
					feature: string;
					answer: number;
					xCoord: number;
					yCoord: number;
					idx: number;
				}[],
				feature,
				idx
			) => {
				const answer = useStartData && startAnswers ? startAnswers[feature] : answers[feature];
				const coords = getCircleCoords({ answer, idx });
				resultArray.push({ feature, answer, xCoord: coords.x, yCoord: coords.y, idx });
				return resultArray;
			},
			[]
		)
	);
</script>

<div class="outer">
	<svg
		id="chart"
		class:overlay={isOverlay}
		class:start={isStart}
		width={config.d}
		height={config.d}
		aria-hidden="true"
	>
		<path
			class="answer"
			class:transition={firstRunComplete}
			stroke-width="3"
			opacity="0.8"
			d={`${drawAnswerShape(useStartData && startAnswers ? startAnswers : answers)}`}
		/>
		<g id="ticks">
			{#each config.ticks as tick}
				<!-- concentric octogons -->
				<polygon points={tickToPolygon(tick)} />
			{/each}
			{#each radialTickLines as f, idx}
				<line x1={config.d / 2} y1={config.d / 2} x2={f.outerX} y2={f.outerY} />
				<line class="dash" x1={f.outerX} y1={f.outerY} x2={f.labelX} y2={f.labelY} />
				{#if skipHover && !showHighlight}
					<g class="label" aria-hidden="true">
						<circle cx={f.labelX} cy={f.labelY} r={config.labelRadius}> </circle>
						<text x={f.labelX} y={f.labelY}>{idx + 1}</text>
					</g>
				{:else}
					<g
						class="label"
						class:highlight={highlight === idx}
						ontouchstart={() => onHover(idx)}
						onmouseenter={() => onHover(idx)}
						onmouseleave={() => onLeave()}
						aria-hidden="true"
					>
						<circle cx={f.labelX} cy={f.labelY} r={config.labelRadius}> </circle>
						<text x={f.labelX} y={f.labelY}>{idx + 1}</text>
					</g>
				{/if}
			{/each}
		</g>
		{#if !isOverlay}
			<g id="answer">
				{#each formattedAnswers as ans}
					<!-- note: adding 1px to radius to make same size as charcoal circle (with stroke of 1px) -->
					<circle cx={ans.xCoord} cy={ans.yCoord} r={config.labelRadius + 1}></circle>
					<text x={ans.xCoord} y={ans.yCoord}>{ans.answer}</text>
				{/each}
			</g>
		{/if}
	</svg>
</div>

<style>
	.outer {
		position: relative;
	}
	svg {
		display: block;
		margin: 0 auto;
	}

	/* TICKS SHAPES */
	#ticks line,
	#ticks polygon {
		fill: none;
		stroke: var(--charcoal);
	}
	line.dash {
		stroke-dasharray: 1px;
	}

	/* ANSWER SHAPES */
	path.answer {
		fill: var(--mustard);
		opacity: 0.5;
	}
	path.answer.transition {
		transition: d 2s ease-in-out;
	}
	#answer circle {
		fill: var(--mustard);
	}
	#answer text {
		fill: var(--cream);
	}

	.start path.answer,
	.start #answer circle {
		fill: var(--moss);
	}
	.overlay.start path.answer {
		opacity: 0.3;
	}

	text {
		/* all <text> elements live inside a circle */
		transform: translate(-5px, 6px);
		font-weight: 500;
		font-size: 18px;
	}
	/* LABELS */
	.label text {
		fill: black;
		text-align: center;
	}
	.label circle {
		fill: var(--sky);
		transition: fill 0.2s linear;
		stroke: var(--charcoal);
		stroke-width: 1;
	}
	.overlay .label circle {
		fill: var(--cream);
	}
	.label.highlight circle {
		fill: var(--charcoal);
	}
	.label.highlight text {
		fill: white;
	}
</style>
