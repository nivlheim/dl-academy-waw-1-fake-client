const Promise = require('bluebird');
class ClientHandler {
	constructor(address) {
		this._address = address;
		this._isRunning = false;
		this._logPrefix = `[${address}]         `.substr(0, 17);
		this._messageCount = 0;
		
		this._log(`New handler created.`);
	}
	
	run() {
		this._isRunning = true;
		
		return this._register()
			.then(this._runMessageWorker.bind(this));
	}
	
	_register() {
		return Promise.resolve(); // TODO
	}
	
	_sendMessage() {
		this._log(`Message sent (${++this._messageCount}).`);
		return Promise.resolve(); // TODO
	}
	
	_runMessageWorker() {
		if(!this._isRunning) {
			return;
		}
		
		const delayTime = (Math.floor(Math.random() * 5) + 1) * 1000;
		
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