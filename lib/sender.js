const { Socket } = require('net');

exports.sender = send;

function send() {
    var client = new Socket();
    client.connect(12097, '127.0.0.1', function() {
        console.log('Connected');
        client.write('Hello, server! Love, Client.');
    });

    client.on('error', (data) => {
        console.log(data);
        client.destroy(); // kill client after server's response
    });
    
    client.on('data', (data) => {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
    });
    
    client.on('close', () => {
        console.log('Connection closed');
    });
}