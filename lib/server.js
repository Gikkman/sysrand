let express = require('express');
let http = require('http');
let app = express();

/************************************************************************
 *  Variables
 ************************************************************************/
let queue = [];
let port = 7911;
let server;

/************************************************************************
 * Module functions
 ************************************************************************/
module.exports.push = (action, path) => {
    let obj = {
        action: action,
        path: path
    }
    queue.push(obj);
}

module.exports.init = () => {
    if(server) return;
    server = http.createServer(app);

    // Start server 
    app.set('port', port);
    server.listen(port, 'localhost');
    server.on('error', onError);

    // Config server
    app.use(express.json());
    
    // Server routes
    app.get("/", (req, res) => {
        let action = queue[0];
        if(action)
            res.send(action.action + ":" + (action.path ? action.path : ""));
        else
            res.send();
    });
    
    app.post("/", (req, res) => {
        queue.shift();
        res.send();
    });

    server.on('listening', onListening);
}

module.exports.bindGet = (url, callback) => {
    app.get(url, (req, res) => {
        callback(req, res);
    });
};

module.exports.bindPost = (url, callback) => {
    app.post(url, (req, res) => {
        callback(req, res);
    });
}

/***********************************************************************
* Internal methods
***********************************************************************/

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'pipe ' + port
        : 'port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        case 'ECONNRESET':
            console.error('Socket hang up');
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    console.log("Server started. Listening on " + addr.address + ":" + addr.port);
}