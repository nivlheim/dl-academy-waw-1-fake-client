const Sentencer = require('sentencer');

/**
 * Generates a pseudo-random nickname.
 * @returns {string}
 */
function getNickname() {
	return Sentencer.make('{{adjective}}-{{noun}}');
}

/**
 * Generates a pseudo-random message.
 * @returns {string}
 */
function getMessage() {
	const string = Sentencer.make(_getSentenceStructure());
	return _capitalizeFirstLetter(string);
}

const sentenceStructures = [
	'This is {{an_adjective}} {{noun}}.',
	'I think that {{noun}} sometimes gets very {{adjective}}.',
	'Is {{noun}} {{adjective}}?',
	'{{noun}} should be {{adjective}}, but instead it\'s {{adjective}}!',
	'My {{noun}} is full of {{nouns}}.',
	'Who is more {{adjective}}: {{noun}}, {{noun}} or {{noun}}?',
	'{{an_adjective}} {{adjective}} {{noun}}!',
	'Shopping list: {{an_adjective}} {{noun}}, {{an_adjective}} {{noun}}, {{an_adjective}} {{noun}}.',
	'Stop calling me {{a_noun}}, you {{adjective}} {{noun}}!',
	"...but {{noun}}'s {{noun}} is not very {{adjective}}."
];

/**
 * Returns random sentence structure.
 * @returns {string}
 * @private
 */
function _getSentenceStructure() {
	return sentenceStructures[Math.floor(Math.random() * (sentenceStructures.length))];
}

/**
 * Capitalizes first letter of the string.
 * @param string String to capitalize.
 * @returns {string} Capitalized string.
 * @private
 */
function _capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	getNickname,
	getMessage
};