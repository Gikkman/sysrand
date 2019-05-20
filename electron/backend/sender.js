const { Socket } = require('net');

exports.sender = send;

var client;
function send() {
    // Create client if none exists
    if(!client) {
        let temp = new Socket();
        temp.connect(53333, '127.0.0.1', function() {
            client = temp;
            console.log('*** Connected ***');
        });

        temp.on('error', (data) => {
            console.log(data);
            temp.destroy(); // kill client after server's response
            client = null;
        });
        
        temp.on('data', (data) => {
            let str = 'Received: ' + data;
            console.log(str.trim());
            temp.destroy(); // kill client after server's response
            client = null;
        });
        
        temp.on('close', () => {
            console.log('*** Connection closed ***');
            temp.destroy(); // kill client after server's response
            client = null;
        });
    }

    // Send message
    if(client) {
        let sent = client.write('Hello, server! Love, Client.\r\n', function() {
            console.log("Wrote to socket");
        });
        console.log("Sent status: " + sent);
    }
}