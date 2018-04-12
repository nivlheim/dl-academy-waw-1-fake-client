const fs = require('fs');
const _ = require('lodash');

/**
 * Reads file with provided name and returns its content as an array of file's lines.
 * @param {string} filename Name of file.
 * @returns {string[]} Lines from file.
 */
function readFileToArray(filename) {
	const lines = fs.readFileSync(filename)
		.toString()
		.split("\n");
	
	return _.compact(lines);
}

module.exports = readFileToArray;