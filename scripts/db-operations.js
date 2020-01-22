import Dexie from '../web_modules/dexie.js';
import download from '../web_modules/downloadjs.js';
import db from './db.js';

class RegisterDbOperations {
	constructor(checkData = () => {}) {
		this.checkData = checkData;
		this.bindEvents();
	}
	bindEvents() {
		document.querySelector('#export-db').addEventListener('click', this.exportDb.bind(this));
		document.querySelector('#import-db').addEventListener('click', this.openFileuploader.bind(this));
		document.querySelector('#delete-db').addEventListener('click', () => { this.recreateDb(db) });
		document.querySelector('#file-uploader').addEventListener('change', this.importDatabase.bind(this));
	}

	async exportDb() {
		const blob = await db.export({ prettyJson: true, progressCallback: this.progressCallback });
		const filenameSuffix = new Date().toLocaleDateString('en').split('/').join('-');
		download(blob, `db-export-${filenameSuffix}.json`, 'application/json');
	}

	openFileuploader() {
		document.querySelector('#file-uploader').click();
	}

	recreateDb(db) {
		return db.delete().then(()=>db.open());
	}

	async importDatabase(ev) {
		const file = ev.target.files[0];
		try {
			console.log(`Importing ${file.name}`);
			this.recreateDb(db);
			await Dexie.import(file, { progressCallback: this.progressCallback });
			console.log('Import complete');
			this.checkData();
		} catch (error) {
			console.log(error);
		}
	}

	progressCallback ({ totalRows, completedRows }) {
		console.log(`Progress: ${completedRows} of ${totalRows} rows completed`);
	}
}

export default RegisterDbOperations;
