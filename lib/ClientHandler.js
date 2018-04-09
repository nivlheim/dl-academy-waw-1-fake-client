const DataGenerator = require('./dataGenerator');
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
		
		this._log(`Registered as a '${this._nickname}'.`);
		
		return request(params);
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
		
		this._log(`Message sent (${++this._messageCount}): "${params.form.body}"`);
		return request(params); // TODO
	}
	
	_runMessageWorker() {
		if(!this._isRunning) {
			return;
		}
		
		const delayTime = Math.floor(Math.random() * MESSAGE_DELAY_MAX) + MESSAGE_DELAY_MIN;
		
		return this._sendMessage()
			.then(() => {
				setTimeout(() => this._runMessageWorker(), delayTime);
			});
	}
	
	_makeRequest() {
		// TODO
	}
	
	_log(message, type = 'info') {
		console[type](`${this._logPrefix} ${message}`);
	}
	
	_handleTimeout() {
		this._isRunning = false;
		this._log('Timeout, swtiching off.', 'error');
	}
}

module.exports = ClientHandler;