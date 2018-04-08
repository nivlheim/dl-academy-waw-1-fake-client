const fs = require('fs');
const _ = require('lodash');

module.exports = {
	read: function (filename) {
		const lines = fs.readFileSync(filename)
			.toString()
			.split("\n");
		
		return _.compact(lines);
	}
};