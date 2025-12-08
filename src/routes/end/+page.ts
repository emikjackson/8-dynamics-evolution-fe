import { PUBLIC_SERVER_URL } from '$env/static/public';

export async function _checkStartCode(
	startCode: string
): Promise<{ success: boolean; message?: string; notFound?: boolean }> {
	try {
		const response = await fetch(`${PUBLIC_SERVER_URL}/api/results?resultCode=${startCode}`, {
			method: 'GET'
		});

		if (!response.ok) {
			// bad request
			if (response.status === 404) {
				return { success: false, notFound: true };
			} else {
				throw new Error('Failed to fetch result code');
			}
		} else {
			return { success: true };
		}
	} catch (err: Error) {
		return { success: false, message: err.message };
	}
}
