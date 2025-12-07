export async function _postResult(
	data: any
): Promise<{ success: boolean; message?: string; invalidFormat?: boolean; data?: any }> {
	try {
		const response = await fetch('/api/result', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			// bad request
			if (response.status === 400) {
				return { success: false, invalidFormat: true };
			} else {
				throw new Error('Failed to send email');
			}
		} else {
			const data = await response.json();
			return { success: true, data };
		}
	} catch (err: Error) {
		return { success: false, message: err.message };
	}
}
