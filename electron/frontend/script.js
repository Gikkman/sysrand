const {ipcRenderer} = require('electron');
const unhandled = require('electron-unhandled');
unhandled();

/************************************************************************
 *  Event listeners
 ************************************************************************/
ipcRenderer
    .on('openDir-res', (event, path) => { 
        console.log("Event 'openDir-res' received. Received data: " + path);
        makeTree(path);
    })
    .on('getAllMetadata-res', (event, obj) => {
        console.log("Event 'getAllMetadata-res' received. Received data: ");
        console.log(obj);
    })
    .on('paths-res', (event, res) => {
        console.log("Event 'paths-res' received. Received data: ");
        console.log(res);
    });

/************************************************************************
 *  Explicit methods
 ************************************************************************/
function onLoad() {
    ipcRenderer.send('getAllMetadata');
    console.log("Event 'getAllMetadata' sent.");  

    ipcRenderer.send('paths');
    console.log("Event 'paths' sent.");  
};
onLoad();

function directory() {
    ipcRenderer.send('openDir');
    console.log("Event 'openDir' sent.");  
}

function loadGame(path, game) {
    ipcRenderer.send("loadGame", path, game);
    console.log("Event 'loadGame' sent.");
}

/************************************************************************
 *  JSTree
 ************************************************************************/
function makeTree(path) {
    $('#container')
    .on("open_node.jstree", (e, data) => {
        $('#container').jstree(true).set_type(data.node.id, "dir-open");
    })
    .on("after_close.jstree", (e, data) => {
        $('#container').jstree(true).set_type(data.node.id, "dir");
    })
    .jstree({
        'core' : {
            'data' : {
                'async': true,
                'url': (node) => {
                    return node.id === '#' ?
                        'http://localhost:7911/scan/' + encodeURIComponent(path) :
                        'http://localhost:7911/scan/' + encodeURIComponent(node.original.path);
                },
                'data' : (node) => {
                    return { 'id' : node.id };
                }
            }
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
            "items": contextMenuItem
        },
    });
}

function contextMenuItem(selectedNode) {
    let items = {};

    if(selectedNode.type === 'file') {
        items.A = {
            label:"Load game",
            action: function(context) {
                let path = selectedNode.original.path;
                let file = selectedNode.original.file;
                loadGame(path, file);
            }};
    }

    items.B = {
        label:"Console log",
        action: function(context) {
            console.log(selectedNode.original);
        }};

    return items;
}