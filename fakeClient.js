const _ = require('lodash');

const ClientHandler = require('./lib/ClientHandler');
const fileReader = require('./lib/fileReader');

const CLIENTS_PER_SERVER = 3;
const clients = [];

// Read clients.txt file, create new client handler and push it to the array.
_.forEach(fileReader.read('clients.txt'), clientAddress => {
	for (let i = 0; i < CLIENTS_PER_SERVER; i++) {
		clients.push(new ClientHandler(clientAddress));
	}
});

// Run all clients.
_.forEach(clients, client => client.run());


