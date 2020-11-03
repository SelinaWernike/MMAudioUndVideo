import FilterManager from "./filterManager.js"
import FileManager from "./fileManager.js"
import EditManager from "./editManager.js"

let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let video = document.querySelector("video")
let input = document.querySelector("input");
input.style.opacity = '0';
let deleteEdit = document.querySelector("#delete")
let filterManager = new FilterManager()
let fileManager = new FileManager()
let filterModal = document.querySelector("#filterModal");
let filterButton = document.querySelector("#filterInput");
let filterModalClose = document.querySelector("#filterModalClose");
let videoManager = new EditManager("videogrid", "videotrack", "mp4")
let audioManager = new EditManager("audiogrid", "audiotrack", "mp3")
let effectManager = new EditManager("effectgrid", "effecttrack", "effect")
resizeCanvas()

videoManager.initializeTrack();
audioManager.initializeTrack();
effectManager.initializeTrack();
//Add Event Listener
video.addEventListener("play", () => {
    requestAnimationFrame(renderVideo)
})

video.addEventListener("seeked", () => {
    renderCurrentFrame()
})

window.addEventListener("resize", () => {
    resizeCanvas()
})

input.addEventListener("change", () => {
    fileManager.addFile();
})

// filterButton.addEventListener("onclick", () => {
//     console.log("add Filter");
//     filterModal.style.display = "block";
// })

filterButton.addEventListener("click", () => {
    console.log("add Filter");
    let filterModalList = document.querySelector("#filterModalList");
    if(filterModalList.childElementCount == 0){
        FilterManager.fillHtmlFilterList(filterModalList);
    }
    console.log("main filterModalList: ", filterModalList);
    filterModal.style.display = "block";
})

filterModalClose.addEventListener("click", () => {
    filterModal.style.display = "none";
})

window.addEventListener("click", (event) => {
    if (event.target == filterModal) {
        filterModal.style.display = "none";
    }
})

deleteEdit.addEventListener("dragover", (ev) => {
    ev.preventDefault();
})
deleteEdit.addEventListener("drop", (ev) => {
    ev.preventDefault()
    let data = ev.dataTransfer.getData("id")
    console.log(data);
    if(data) {
        let temp = document.querySelector("#" + data)
        temp.remove()

    }
})

listElements.forEach(element => {
    element.setAttribute("draggable", true);
    element.addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData("id", ev.target.id);
    })
    element.addEventListener("dragend", (e) => {
        e.preventDefault();
    })
});

items.forEach(element => {
    element.setAttribute("draggable", true);
    element.addEventListener("dragstart", (ev) => {
        console.log(ev.target.id)
        ev.dataTransfer.setData("id", ev.target.id);
    })
    element.addEventListener("dragend", (e) => {
        e.preventDefault();
    })
});

window.onPlayPauseClick = function(event) {
    if (video.paused) {
        event.target.value = "Pause"
        video.play()
    } else {
        event.target.value = "Play"
        video.pause()
    }
}

function resizeCanvas() {
    canvas.width = canvas.parentNode.clientWidth;
    canvas.height = canvas.parentNode.clientHeight;
}

function renderVideo() {
    if (!video.paused && !video.ended) {
        renderCurrentFrame()
        requestAnimationFrame(renderVideo)
    }
}

function renderCurrentFrame() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    let currentFrame = context.getImageData(0, 0, canvas.width, canvas.height)
    let newFrame = filterManager.apply(currentFrame)
    context.putImageData(newFrame, 0, 0)
}
