const request = require('request-promise');

const dataGenerator = require('./dataGenerator');
const Logger = require('./Logger');

const MESSAGE_DELAY_MIN = 1000;
const MESSAGE_DELAY_MAX = 5000;

class Client {
	constructor(address) {
		this._address = `http://${address}`;
		this._isActive = false;
		this._messageCount = 0;
		this._nickname = dataGenerator.getNickname();
		this._logger = new Logger(address);
		this._messageTimeoutHandler = null;
		
		this._logger.write(`New handler created.`);
	}
	
	/**
	 * Enables fake client, registers its username and starts the message worker.
	 */
	async run() {
		this._isActive = true;
		
		try {
			await this._register();
			await this._runMessageWorker();
		}
		catch(e) {
			this._isActive = false;
			this._logger.write(e, 'error');
		}
	}
	
	/**
	 * Stops message loop and sends http request to '/disconnect' endpoint.
	 * @returns {Promise.<undefined>}
	 */
	async disconnect() {
		// Do not try to disconnect if client is not active.
		if(!this._isActive) {
			return Promise.resolve();
		}
		
		this._isActive = false;
		clearTimeout(this._messageTimeoutHandler);
		
		const params = {
			method: 'POST',
			url: `${this._address}/disconnect`,
			form: {
				username: this._nickname
			}
		};
		
		try {
			await request(params);
			this._logger.write(`Disconnected.`);
		}
		catch(e) {
			this._handleError(e);
		}
	}
	
	/**
	 * Performs registration request.
	 * @returns {Promise.<undefined>}
	 * @private
	 */
	async _register() {
		const params = {
			method: 'POST',
			url: `${this._address}/connect`,
			form: {
				username: this._nickname
			}
		};
		
		try {
			await request(params);
			this._logger.write(`Registered.`);
		}
		catch(e) {
			this._handleError(e);
		}
	}
	
	/**
	 * Sends pseudo-randomly generated message.
	 * @returns {Promise.<undefined>}
	 * @private
	 */
	async _sendMessage() {
		const params = {
			method: 'POST',
			url: `${this._address}/messages`,
			form: {
				username: this._nickname,
				body: dataGenerator.getMessage()
			}
		};
		

		await request(params);
		this._logger.write(`Message sent (${++this._messageCount}): "${params.form.body}"`);
	}
	
	/**
	 * Handles message-sending loop.
	 * @private
	 */
	async _runMessageWorker() {
		const delayTime = Math.floor(Math.random() * MESSAGE_DELAY_MAX) + MESSAGE_DELAY_MIN;
		
		if(!this._isActive) {
			return;
		}
		
		try {
			await this._sendMessage();
			this._messageTimeoutHandler = setTimeout(() => this._runMessageWorker(), delayTime);
		}
		catch(e) {
			this._handleError(e);
		}
	}
	
	/**
	 * Stops message loop and displays the error message.
	 * @param error
	 * @private
	 */
	_handleError(error) {
		this._isActive = false;
		clearTimeout(this._messageTimeoutHandler);
		this._logger.write(error, 'error');
	}
}

module.exports = Client;