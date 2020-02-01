class Charts {

	static async prepareMemberEvents(memberEvents) {
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

}

export default Charts;
