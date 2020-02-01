import env from '../env.js';

class Utilities {
	static async req(api, qs, method = 'GET', headers = {}) {
		const response = await fetch(`${env.baseUrl}/api/v4/${api}?per_page=500`, {
			method,
			headers: {
				...headers,
				'PRIVATE-TOKEN': env.token,
			}
		});
		return await response.json();
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
