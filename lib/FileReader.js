const fs = require('fs');
const _ = require('lodash');

module.exports = {
	/**
	 * Reads file with provided name and returns its content as an array of file's lines.
	 * @param {string} filename Name of file.
	 * @returns {string[]} Lines from file.
	 */
	read: function (filename) {
		const lines = fs.readFileSync(filename)
			.toString()
			.split("\n");
		
		return _.compact(lines);
	}
};