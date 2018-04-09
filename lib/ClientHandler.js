const DataGenerator = require('./DataGenerator');
const request = require('request-promise');

const MESSAGE_DELAY_MIN = 1000;
const MESSAGE_DELAY_MAX = 5000;

class ClientHandler {
	constructor(address) {
		this._address = `http://${address}`;
		this._isRunning = false;
		this._logPrefix = `[${address}]               `.substr(0, 23);
		this._messageCount = 0;
		this._nickname = DataGenerator.getNickname();
		
		this._log(`New handler created.`);
	}
	
	run() {
		this._isRunning = true;
		
		return this._register()
			.then(this._runMessageWorker.bind(this));
	}
	
	_register() {
		const params = {
			method: 'POST',
			url: `${this._address}/connect`,
			form: {
				username: this._nickname
			}
		};
		
		return this._makeRequest(params)
			.then(() => this._log(`Registered as a '${this._nickname}'.`));
	}
	
	_sendMessage() {
		const params = {
			method: 'POST',
			url: `${this._address}/messages`,
			form: {
				username: this._nickname,
				body: DataGenerator.getMessage()
			}
		};
		

		return this._makeRequest(params)
			.then(() => this._log(
				`Message sent (${++this._messageCount}): "${params.form.body}"`
			));
	}
	
	_runMessageWorker() {
		const delayTime = Math.floor(Math.random() * MESSAGE_DELAY_MAX) + MESSAGE_DELAY_MIN;
		
		return this._sendMessage()
			.then(() => {
				if(this._isRunning) {
					setTimeout(() => this._runMessageWorker(), delayTime);
				}
			});
	}
	
	_makeRequest(params) {
		return request(params)
			.catch(this._handleError.bind(this));
	}
	
	_log(message, type = 'info') {
		return console[type](`${this._logPrefix} ${message}`);
	}
	
	_handleError(e) {
		this._isRunning = false;
		this._log(e, 'error');
	}
}

module.exports = ClientHandler;