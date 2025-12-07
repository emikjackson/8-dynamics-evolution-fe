import { statusIsGood } from '$lib/helpers/general';

// TODO: Make this not an api call
export async function POST({ request }) {
	try {
		const data = await request.json();
		const response = await fetch('http://localhost:8000/api/results', {
			method: 'POST',
			body: JSON.stringify({
				...data,
				groupCode: '000000',
				sessionId: '12345'
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (!statusIsGood(response.status)) {
			throw new Error(`Bad request, got status ${response.status}`);
		}

		const body = await response.json();

		return new Response(JSON.stringify(body), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: `Failed to send email. ${err}` }), { status: 500 });
	}
}
