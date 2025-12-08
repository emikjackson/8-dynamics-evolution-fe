export const statusIsGood = (status: number) => status >= 200 && status < 300;

export const delay = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
