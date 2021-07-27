var ipc = require("electron").ipcRenderer;

const dialog = require("electron").remote.dialog;

const browserWindow = require('electron').remote.getCurrentWindow()

alert = function(txt) {
    dialog.showMessageBoxSync(browserWindow, {"message": txt, "type":"question"})
}
confirm = function(txt) {
    let retVal = dialog.showMessageBoxSync(browserWindow, {"message": txt, "type":"error", "buttons": ["OK", "Cancel"], "defaultId":0, "cancelId":1})
    if(retVal == 0) {
        return true;
    }
    else {
        return false;
    }
}
var imageArray = []
var currentImageIndex = 0;
var secondsOnImage = 5;
var loop = true;
var isPaused = true;

let isToolbarVisible = true;
let hideToolbarBtn = document.getElementById("hideToolbarBtn")
hideToolbarBtn.addEventListener("click", changeVisibilityOfToolbar)

function changeVisibilityOfToolbar() {
    if(isToolbarVisible) {
        document.getElementById("toolbar").style.display = 'none'
        isToolbarVisible = false;
    }
    else {
        document.getElementById("toolbar").style.display = 'initial'
        isToolbarVisible = true;
    }
}

let addFilesBtn = document.getElementById("addFilesBtn")
addFilesBtn.addEventListener("click", function() {
    ipc.send("AddFiles", "")
})

let addFolderBtn = document.getElementById("addFolderBtn")
addFolderBtn.addEventListener("click", function() {
    ipc.send("AddFolder", "")
})

ipc.on("AddMediaResponse", function(event, data) {
    let dataObject = JSON.parse(data)
    console.log(dataObject)
    if(dataObject.success) {
        // then go through the files array and then add them to the imageArray
        for(var i = 0; i < dataObject.files.length; i++) {
            imageArray.push(dataObject.files[i])
        }
        alert(dataObject.files.length + " File(s) Added")
        loadCurrentImage()
    }
    else {
        alert(dataObject.error)
    }
})

let openSettingsBtn = document.getElementById("openSettingsBtn");
openSettingsBtn.addEventListener("click", openSettings);

let closeSettingsBtn = document.getElementById("close");
closeSettingsBtn.addEventListener("click", closeSettings);

function openSettings() {
    document.getElementById("settingsModal").style.display = 'block';
}
function closeSettings() {
    document.getElementById("settingsModal").style.display = 'none';
}

let saveSettingsBtn = document.getElementById("saveSettingsBtn");
saveSettingsBtn.addEventListener("click", saveSettings);

function saveSettings() {
    let attemptedSecondsOnImage = document.getElementById("settings_secondsOnImage").value;
    if(attemptedSecondsOnImage >= 0.1) {
        secondsOnImage = attemptedSecondsOnImage;
    }
    else {
        alert("TimeOutOfRange: The minimum time on each image is 0.1 seconds");
    }
    loop = document.getElementById("settings_loop").checked;
    closeSettings()
}



let restartSlideshowBtn = document.getElementById("restartSlideshowBtn");
restartSlideshowBtn.addEventListener("click", function() {
    currentImageIndex = 0;
    loadCurrentImage()
})

function loadCurrentImage() {
    document.getElementById("img").src = imageArray[currentImageIndex]
}

let backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", backImg)

function backImg() {
    if(currentImageIndex == 0 && loop) {
        currentImageIndex = imageArray.length-1
    }
    else if(currentImageIndex > 0) {
        currentImageIndex--
    }
    else {
        alert("This Is The Start Of The Slideshow")
    }
    loadCurrentImage()
}

let nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener("click", nextImg)

function nextImg() {
    if(currentImageIndex == imageArray.length-1 && loop) {
        currentImageIndex = 0;
    }
    else if(currentImageIndex < imageArray.length-1) {
        currentImageIndex++
    }
    else {
        alert("This Is The End Of The Slideshow")
    }
    loadCurrentImage()
}


let playPauseBtn = document.getElementById("playPauseBtn");
playPauseBtn.addEventListener("click", playPause);

function playPause() {
    
}