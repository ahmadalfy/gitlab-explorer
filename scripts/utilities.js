class Utilities {
	static async req(api, qs, method = 'GET', headers = {}) {
		const response = await fetch(`https://gitlab.com/api/v4/${api}?per_page=500`, {
			method,
			headers: {
				...headers,
				'PRIVATE-TOKEN': 'C_LNxtoXEpUwQ9GxTYcy',
			}
		});
		return await response.json();
	}
}

export default Utilities;
