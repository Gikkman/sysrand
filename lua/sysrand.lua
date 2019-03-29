local socket = require("socket")
local server = nil

local port = 12097

function server.start()
    --create the server
    server = socket.bind("*", port, 1)
    if (server == nil) then
        printOutput("Error creating server. Port is probably in use.")
        return false
    end

    local ip, setport = server:getsockname()
    server:settimeout(0) -- non-blocking
    printOutput("Created server on port " .. setport)
end

function server.listen()
    if (server == nil or host.locked) then
        return false
    end
    
    --wait for the connection from the client
    local client, err = server:accept()

    --end execution if a client does not connect in time
    if (client == nil) then
        if err ~= "timeout" then
            printOutput("Server error: ", err)
        end
          return false
    end
end