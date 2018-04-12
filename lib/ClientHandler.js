const request = require('request-promise');

const dataGenerator = require('./dataGenerator');
const Logger = require('./Logger');

const MESSAGE_DELAY_MIN = 1000;
const MESSAGE_DELAY_MAX = 5000;

class ClientHandler {
	constructor(address) {
		this._address = `http://${address}`;
		this._isRunning = false;
		this._messageCount = 0;
		this._nickname = dataGenerator.getNickname();
		this._logger = new Logger(address);
		this._messageTimeoutHandler = null;
		
		this._logger.write(`New handler created.`);
	}
	
	/**
	 * Enables fake client, registers its username and starts the message worker.
	 */
	run() {
		this._isRunning = true;
		
		this._register()
			.then(this._runMessageWorker.bind(this))
			.catch(error => {
				this._isRunning = false;
				this._logger.write(error, 'error');
			});
	}
	
	/**
	 * Stops message loop and sends http request to '/disconnect' endpoint.
	 * @returns {Promise.<undefined>}
	 */
	disconnect() {
		this._isRunning = false;
		clearTimeout(this._messageTimeoutHandler);
		
		const params = {
			method: 'POST',
			url: `${this._address}/disconnect`,
			form: {
				username: this._nickname
			}
		};
		
		return request(params)
			.then(() => this._logger.write(`Disconnected.`))
			.catch(this._handleError.bind(this));
	}
	
	/**
	 * Performs registration request.
	 * @returns {Promise.<undefined>}
	 * @private
	 */
	_register() {
		const params = {
			method: 'POST',
			url: `${this._address}/connect`,
			form: {
				username: this._nickname
			}
		};
		
		return request(params)
			.then(() => {
				this._logger.write(`Registered as a ${this._nickname}.`);
			})
			.catch(this._handleError.bind(this));
	}
	
	/**
	 * Sends pseudo-randomly generated message.
	 * @returns {Promise.<undefined>}
	 * @private
	 */
	_sendMessage() {
		const params = {
			method: 'POST',
			url: `${this._address}/messages`,
			form: {
				username: this._nickname,
				body: dataGenerator.getMessage()
			}
		};
		

		return request(params)
			.then(() => this._logger.write(
				`Message sent (${++this._messageCount}): "${params.form.body}"`
			));
	}
	
	/**
	 * Handles message-sending loop.
	 * @private
	 */
	_runMessageWorker() {
		const delayTime = Math.floor(Math.random() * MESSAGE_DELAY_MAX) + MESSAGE_DELAY_MIN;
		
		if(!this._isRunning) {
			return;
		}
		
		this._sendMessage()
			.then(() => {
				this._messageTimeoutHandler = setTimeout(() => this._runMessageWorker(), delayTime);
			})
			.catch(this._handleError.bind(this));
	}
	
	/**
	 * Stops message loop and displays the error message.
	 * @param error
	 * @private
	 */
	_handleError(error) {
		this._isRunning = false;
		clearTimeout(this._messageTimeoutHandler);
		this._logger.write(error, 'error');
	}
}

module.exports = ClientHandler;