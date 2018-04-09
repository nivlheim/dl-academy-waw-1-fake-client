const DataGenerator = require('./DataGenerator');
const request = require('request-promise');

const MESSAGE_DELAY_MIN = 1000;
const MESSAGE_DELAY_MAX = 5000;

class ClientHandler {
	constructor(address) {
		this._address = `http://${address}`;
		this._isRunning = false;
		// Next line is a trick used to print column-like messages in console.
		this._logPrefix = `[${address}]               `.substr(0, 23);
		this._messageCount = 0;
		this._nickname = DataGenerator.getNickname();
		this._messageTimeout = null;
		
		this._log(`New handler created.`);
	}
	
	/**
	 * Enables fake client, registers it's username and starts the message worker.
	 */
	run() {
		this._isRunning = true;
		
		this._register()
			.then(this._runMessageWorker.bind(this))
			.catch(error => {
				this._isRunning = false;
				this._log(error, 'error');
			});
	}
	
	/**
	 * Stops message loop and sends http request to '/disconnect' endpoint.
	 * @returns {Promise.<undefined>}
	 */
	disconnect() {
		this._isRunning = false;
		clearTimeout(this._messageTimeout);
		
		const params = {
			method: 'POST',
			url: `${this._address}/disconnect`,
			form: {
				username: this._nickname
			}
		};
		
		return request(params)
			.then(() => this._log(`Disconnected.`))
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
				this._log(`Registered as a '${this._nickname}'.`);
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
				body: DataGenerator.getMessage()
			}
		};
		

		return request(params)
			.then(() => this._log(
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
				this._messageTimeout = setTimeout(() => this._runMessageWorker(), delayTime);
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
		clearTimeout(this._messageTimeout);
		this._log(error, 'error');
	}
	
	/**
	 * Sends provided message to the console.
	 * @param {string} message Content of the message.
	 * @param {string} [type=info] Type of the message (info, warning, error).
	 * @private
	 */
	_log(message, type = 'info') {
		return console[type](`${this._logPrefix} ${message}`);
	}
}

module.exports = ClientHandler;