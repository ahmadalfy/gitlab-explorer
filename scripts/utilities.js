import env from '../env.js';

class Utilities {
	static async req(api, qs = 'per_page=100', method = 'GET', headers = {}, page = 1, data = []) {
		let response = await fetch(`${env.baseUrl}/api/v4/${api}?${qs}&page=${page}`, {
			method,
			headers: {
				...headers,
				'PRIVATE-TOKEN': env.token,
			}
		});
		response = await response.json();
		const updatedResponse = [...data, ...response];
		if (response.length === 100 ) {
			var nextPage = page + 1;
			return Utilities.req(api, qs, method, headers, nextPage, updatedResponse);
		} else {
			return updatedResponse;
		}
	}

	static debounce(func, wait, immediate) {
		let timeout;
		return function() {
			const context = this;
			const args = arguments;
			const later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}
}

export default Utilities;
