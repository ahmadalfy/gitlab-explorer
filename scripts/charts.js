class Charts {

	static prepareMemberEvents(memberEvents) {
		const formattedData = [];
		for (let date in memberEvents.events) {
			formattedData.push([JSON.parse(date), memberEvents.events[date].length]);
		}
		const today = new Date().setHours(0, 0, 0, 0);
		if (!memberEvents.events[today]) {
			formattedData.unshift([today, 0]);
		}
		return { data: formattedData.reverse(), memberEvents };
	}

	static prepareUserDetailedData(memberEvents) {
		const formattedData = [];
		for (let date in memberEvents.events) {
			memberEvents.events[date].forEach(event => {
				const stack = formattedData.find(data => data.name === event.action_name);
				if (!stack) {
					formattedData.push({
						name: event.action_name,
						data: [[ event.creation_day, 1 ]],
						stack: 0,
						type: 'column',
					});
				} else {
					const datedStack = stack.data.find(item => event.creation_day === item[0]);
					if (!datedStack) {
						stack.data.unshift([ event.creation_day, 1 ]);
					} else {
						datedStack[1] += 1;
					}
				}
			});
		}
		return { data: formattedData, memberEvents };
	}
}

export default Charts;
