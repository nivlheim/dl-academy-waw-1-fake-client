const _ = require('lodash');

const Client = require('./lib/Client');
const readFileToArray = require('./lib/readFileToArray');

const CLIENTS_PER_SERVER = 3;
const servers = readFileToArray('servers.txt');
const clients = [];

// Create new client handler and push it to the array.
servers.forEach(serverAddress => {
	for (let i = 0; i < CLIENTS_PER_SERVER; i++) {
		clients.push(new Client(serverAddress));
	}
});

// Run all clients.
clients.forEach(client => client.run());

// Catch application stopping signal, disconnect clients and quit gracefully.
process.on('SIGINT', () => {
	const disconnectPromises = _.map(clients, client => client.disconnect());
	return Promise.all(disconnectPromises)
		.then(() => process.exit);
});