import { PUBLIC_SERVER_URL } from '$env/static/public';
import { statusIsGood } from '$lib/helpers/general';
import { error } from '@sveltejs/kit';

const dbKeysToToolKeys: any = {
	d1: 'A',
	d2: 'B',
	d3: 'C',
	d4: 'D',
	d5: 'E',
	d6: 'F',
	d7: 'G',
	d8: 'H'
};

const transformResults = (data: any) => {
	if (!data) {
		return null;
	}

	const answers = Object.keys(data)
		.filter((k) => dbKeysToToolKeys[k])
		.map((k) => ({
			key: dbKeysToToolKeys[k],
			value: data[k]
		}));

	const object = {
		A: data.d1,
		B: data.d2,
		C: data.d3,
		D: data.d4,
		E: data.d5,
		F: data.d6,
		G: data.d7,
		H: data.d8
	};

	return {
		answers,
		object,
		isStart: data?.isStart
	};
};

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }: { params: { code: string }; fetch: any }) {
	const { code } = params;
	const response = await fetch(`${PUBLIC_SERVER_URL}/api/results?resultCode=${code}`, {
		method: 'GET'
	});

	if (!statusIsGood(response.status)) {
		error(500);
	}

	const data = await response.json();

	if (!data) {
		error(404, 'Not Found');
	}

	const currentResults = data.currentResults;
	const startingPointResults = data.startingPointResults; // this should be null if it's a starting point quiz

	return {
		current: transformResults(currentResults),
		start: transformResults(startingPointResults),
		code
	};
	// 	return {
	// 	answers: matches.map((m) => {
	// 		// matches is an array of arrays with values like
	// 		// ['h2', 'h', '2', index: 14, ...]
	// 		return { key: m[1].toUpperCase(), value: m[2] };
	// 	}),
	// 	object: matches.reduce((prev: Record<string, number>, curr) => {
	// 		prev[curr[1].toUpperCase()] = parseInt(curr[2], 10);
	// 		return prev;
	// 	}, {}),
	// 	code
	// };
	// const matches = [...results_string.matchAll(new RegExp(/([a-h])([1-5])/gi))];
	// if (matches.length !== 8) {
	// 	error(404, 'invalid match string');
	// }
	// return {
	// 	answers: matches.map((m) => {
	// 		// matches is an array of arrays with values like
	// 		// ['h2', 'h', '2', index: 14, ...]
	// 		return { key: m[1].toUpperCase(), value: m[2] };
	// 	}),
	// 	object: matches.reduce((prev: Record<string, number>, curr) => {
	// 		prev[curr[1].toUpperCase()] = parseInt(curr[2], 10);
	// 		return prev;
	// 	}, {}),
	// 	code
	// };
}

// export async function _sendEmail(
// 	email: string,
// 	results_string: string
// ): Promise<{ success: boolean; message?: string; invalidFormat?: boolean }> {
// 	try {
// 		const response = await fetch('/api/email', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({ email, results_string })
// 		});

// 		if (!response.ok) {
// 			// bad request
// 			if (response.status === 400) {
// 				return { success: false, invalidFormat: true };
// 			} else {
// 				throw new Error('Failed to send email');
// 			}
// 		} else {
// 			return { success: true };
// 		}
// 	} catch (err: Error) {
// 		return { success: false, message: err.message };
// 	}
// }

export async function _sendEmail(
	email: string,
	results_string: string
): Promise<{ success: boolean; message?: string; invalidFormat?: boolean }> {
	try {
		const response = await fetch('/api/email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, results_string })
		});

		if (!response.ok) {
			// bad request
			if (response.status === 400) {
				return { success: false, invalidFormat: true };
			} else {
				throw new Error('Failed to send email');
			}
		} else {
			return { success: true };
		}
	} catch (err: Error) {
		return { success: false, message: err.message };
	}
}

export const csr = true;
export const prerender = false;
