module.exports = function() {
    let express = require('express');
    let http = require('http');
    let app = express();

    /************************************************************************
     *  Variables
     ************************************************************************/
    let queue = [];
    let port = 7911;
    let server = http.createServer(app);

    /************************************************************************
     * Module behaviours
     ************************************************************************/
    let mod = {};
    mod.init = () => {
        // Start server 
        app.set('port', port);
        server.listen(port, 'localhost');
        server.on('error', onError);
        server.on('listening', onListening);

        // Server routes
        app.get("/", (req, res) => {
            console.log("get " + Date.now())
            let action = queue[0];
            if(action)
                res.send(action.action + ":" + action.path);
            else
                res.send();
        });

        app.post("/", (req, res) => {
            console.log("post")
            queue.shift();
            res.send();
        });
    }
    
    mod.push = (action, path) => {
        let obj = {
            action: action,
            path: path
        }
        queue.push(obj);
    }

    return mod;

    /***********************************************************************
     *          INTENRAL METHODS
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
        console.log("--- Server started. Listening on " + addr.address + ":" + addr.port);
    }
}