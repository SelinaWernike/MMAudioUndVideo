import FilterManager from "./filterManager.js"
import FileManager from "./fileManager.js"
import EditManager from "./editManager.js"

let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let video = document.querySelector("video")
let input = document.querySelector("input");
input.style.opacity = '0';
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
    filterManager.apply(currentFrame)
    context.putImageData(currentFrame, 0, 0)
}
