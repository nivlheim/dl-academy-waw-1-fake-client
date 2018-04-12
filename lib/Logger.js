const FIRST_COLUMN_LENGTH = 23;

class Logger {
	constructor(messagePrefix) {
		const prefixBegenning = `[${messagePrefix}]`;
		const prefixEnding = ' '.repeat(FIRST_COLUMN_LENGTH - prefixBegenning.length);
		this._prefix = prefixBegenning + prefixEnding;
	}
	
	/**
	 * Writes provided message in the console.
	 * @param {string} message Content of the message.
	 * @param {string} [type=info] Type of the message (info, warning, error).
	 */
	write(message, type = 'info') {
		return console[type](`${this._prefix} ${message}`);
	}
}

module.exports = Logger;