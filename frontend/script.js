const {ipcRenderer} = require('electron');

ipcRenderer.on('fileData', (event, data) => { 
    console.log("Event 'fileData' received.");
    makeTree(data);
})
         
function directory() {
    ipcRenderer.send('openDir');
    console.log("Event 'openDir' sent.");  
}

function loadGame(path, game) {
    ipcRenderer.send("loadGame", path, game);
    console.log("Event 'loadGame' sent.");
}

function makeTree(data) {
    $('#container')
    .on("open_node.jstree", (e, data) => {
        $('#container').jstree(true).set_type(data.node.id, "dir-open");
    })
    .on("after_close.jstree", (e, data) => {
        $('#container').jstree(true).set_type(data.node.id, "dir");
    })
    .jstree({
        'core' : {
            'data' : data
        },
        "plugins": ["wholerow", "types", "contextmenu"],
        "types" : {
            "default" : {
                "icon" : "fas fa-folder"
            },
            "dir" : {
                "icon" : "fas fa-folder"
              },
            "dir-open" : {
                "icon" : "fas fa-folder-open"
              },
            "file" : {
                "icon" : "fas fa-file"
            }
          },
        "contextmenu": {
            "items": function(selectedNode) {
                if(selectedNode.type === 'file') {
                    return {
                        A:{
                            label:"Load game",
                            action: function(context) {
                                let path = selectedNode.original.path;
                                let file = selectedNode.original.file;
                                loadGame(path, file);
                            },
                        },
                        B:{
                            label:"Console log",
                            action: function(context) {
                                console.log(selectedNode.original);
                            }
                        }
                    }
                }
            }
        },
    });
}