const _ = require('lodash');

const ClientHandler = require('./lib/ClientHandler');
const FileReader = require('./lib/FileReader');

const CLIENTS_PER_SERVER = 3;
const clients = [];

// Read clients.txt file, create new client handler and push it to the array.
_.forEach(FileReader.read('servers.txt'), serverAddress => {
	for (let i = 0; i < CLIENTS_PER_SERVER; i++) {
		clients.push(new ClientHandler(serverAddress));
	}
});

// Run all clients.
_.forEach(clients, client => client.run());


