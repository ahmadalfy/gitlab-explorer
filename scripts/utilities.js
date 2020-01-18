class Utilities {
	static req(api, qs, method = 'GET', headers = {}) {
		return fetch(`https://gitlab.com/api/v4/${api}?per_page=500`, {
			method,
			headers: {
				...headers,
				'PRIVATE-TOKEN': 'C_LNxtoXEpUwQ9GxTYcy',
			}
		})
		.then(response => response.json());
	}
}

export default Utilities;
