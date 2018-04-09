const Sentencer = require('sentencer');

function getNickname() {
	return Sentencer.make('{{adjective}}-{{noun}}');
}

function getMessage() {
	const string = Sentencer.make(_getSentenceStructure());
	return string.charAt(0).toUpperCase() + string.slice(1);
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

function _getSentenceStructure() {
	return sentenceStructures[Math.floor(Math.random() * (sentenceStructures.length))];
}

module.exports = {
	getNickname,
	getMessage
};