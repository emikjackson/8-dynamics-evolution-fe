export const prettyCode = (code: number | string) => {
	const strCode = `${code}`;
	if (!(strCode.length === 6)) {
		return 'Invalid Code';
	}
	return `${strCode.slice(0, 3)} ${strCode.slice(3, 6)}`;
};
