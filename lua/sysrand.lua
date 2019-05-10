local url = "http://127.0.0.1:7911"
local frameCount = 0

function request() 
    res = comm.httpGet(url)
    print(res)
    if (res ~= '') then
        action = string.sub(res, 1, 4)
        print("Action: " .. action)
        
        path = string.sub(res, 6)
        if(path ~= '') then
            print("Path: " .. path)
        end

        if (action == 'PAUS') then
            client.SetSoundOn(false)
            comm.httpPost(url, "")
        elseif (action == 'SAVE') then
            savestate.save(path)
            comm.httpPost(url, "")
            request()
        elseif (action == 'GAME') then
            client.openrom(path)
            comm.httpPost(url, "")
            request()
        elseif (action == 'LOAD') then
            savestate.load(path)
            comm.httpPost(url, "")
            request()
        elseif (action == 'CONT') then
            client.SetSoundOn(true)
            comm.httpPost(url, "")
        end
        
    end
end

while true do
    if (math.fmod(frameCount, 12) == 0) then 
        request()
    end

    emu.yield()
    frameCount = frameCount + 1
end