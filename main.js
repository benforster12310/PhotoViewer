const { app, BrowserWindow, Menu } = require('electron')
const { dialog } = require('electron')
var ipc = require("electron").ipcMain;
const fs = require('fs');
const path = require('path');
const isImage = require("is-image")

// then handle squirrel events

function createWindow (width, height, file, maximised, menu) {
    const win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate([menu]))
    
    if(maximised) {
        win.maximize()
    }
  
    win.loadFile(file)
    return win;
}

let mainWindow = null;

// when ready create the main window
app.whenReady().then(() => {
    let menuOptions = {
        label: "File",
        submenu: [
            {
                label: "Show/Hide Toolbar",
                click() {
                    mainWindow.webContents.executeJavaScript("changeVisibilityOfToolbar()") 
                }
            },
            {
                label: "Exit",
                click() {
                    app.quit()
                }
            }
        ]
    }
    mainWindow = createWindow(800, 600, "pages/index.html", true, menuOptions)
})

app.on('window-all-closed', function () {
    if(process.platform !== 'darwin') app.quit()
})

// Handle the AddFiles button from the index page

ipc.on("AddFiles", function(event, data) {
    var returnObject = {"files": []}
    var result = dialog.showOpenDialogSync(mainWindow, { properties: ["openFile", "multiSelections"], title: "Add Files To Slideshow", buttonLabel: "Add File(s)" })
    if(result != undefined || result != null) {
        for(var i = 0; i < result.length; i++) {
            if(isImage(result[i])) {
                returnObject.files.push(result[i]);
            }
        }
        if(returnObject.files.length != 0) {
            returnObject.success = true;
        }
        else {
            returnObject.success = false;
            returnObject.error = "The File(s) You Selected Are Not Images";
        }
    }
    else {
        returnObject.success = false;
        returnObject.error = "You Closed The Prompt";
    }
    event.sender.send("AddMediaResponse", JSON.stringify(returnObject));
})

ipc.on("AddFolder", function(event, data) {
    var returnObject = {"files": []}
    var result = dialog.showOpenDialogSync(mainWindow, { properties: ["openDirectory"], title: "Add A Folder To Slideshow", buttonLabel: "Add Folder" })
    if(result != undefined || result != null) {
        let filePath = result[0];
        // then search through the folder and chack if the items are files, then images
        fs.readdirSync(filePath, { withFileTypes:true }).forEach(file => {
            // then check if it is a file
            if(file.isFile()) {
                // then check if it is an image
                if(isImage(file.name)) {
                    // then add it to the fullPathsArray
                    returnObject.files.push(filePath + "\\" + file.name);
                }
            }
        })
        if(returnObject.files.length != 0) {
            returnObject.success = true;
        }
        else {
            returnObject.success = false;
            returnObject.error = "No Images In Folder";
        }
    }
    else {
        returnObject.success = false;
        returnObject.error = "You Closed The Prompt";
    }
    event.sender.send("AddMediaResponse", JSON.stringify(returnObject));
})