import Dexie from '../web_modules/dexie.js';
import relationships from '../web_modules/dexie-relationships.js';

const db = new Dexie('gitlab', {addons: [relationships]});
db.version(1).stores({
	groups: 'id, name',
	members: 'id, name, &username',
	projects: 'id, name, group_id -> groups.id',
	events: 'created_at, project_id -> projects.id, author_id -> members.id',
	member_events: 'id++, member_id -> members.id',
});

export default db;
