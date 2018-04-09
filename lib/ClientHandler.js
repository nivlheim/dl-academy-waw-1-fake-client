const Promise = require('bluebird');
const DataGenerator = require('./dataGenerator');

const MESSAGE_DELAY_MIN = 1000;
const MESSAGE_DELAY_MAX = 5000;

class ClientHandler {
	constructor(address) {
		this._address = address;
		this._isRunning = false;
		this._logPrefix = `[${address}]          `.substr(0, 18);
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
		// const message = {
		// 	username: this._nickname
		// };
		
		this._log(`Registered as a '${this._nickname}'.`);
		return Promise.resolve(); // TODO
	}
	
	_sendMessage() {
		const message = DataGenerator.getMessage();
		
		// const message = {
		// 	sender: this._nickname,
		// 	body: 'foo'
		// };
		
		this._log(`Message sent (${++this._messageCount}): "${message}"`);
		return Promise.resolve(); // TODO
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