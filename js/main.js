import VideoController from "./videoController.js"
import FilterManager from "./filterManager.js"
import FileManager from "./fileManager.js"
import EditManager from "./editManager.js"
import DownloadManager from "./downloadManager.js";
import AudioLoader from "./audioloader.js"
import VideoLoader from "./videoloader.js"
import EffectLoader from "./effectLoader.js"
import TrackController from "./trackController.js"

let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let video = document.querySelector("video")
let fileInput = document.querySelector("#fileInput");
let filterManager = new FilterManager()
let fileManager = new FileManager()
let videoManager = new EditManager("videotrack", new VideoLoader(fileManager))
let audioManager = new EditManager("audiotrack", new AudioLoader(fileManager))
let effectManager = new EditManager("effecttrack", new EffectLoader(filterManager))
const trackController = new TrackController(videoManager, audioManager, effectManager);
const videoController = new VideoController(fileManager, videoManager)
const downloadManager = new DownloadManager(videoController);
resizeCanvas()

videoManager.initializeTrack();
audioManager.initializeTrack();
effectManager.initializeTrack();
//Add Event Listener
document.querySelector("#videotrack").addEventListener("trackChange", function(event) {
    trackController.setEndTime();
});

video.addEventListener("play", () => {
    requestAnimationFrame(renderVideo)
})

video.addEventListener("seeked", () => {
    renderCurrentFrame()
})

window.addEventListener("resize", () => {
    resizeCanvas()
})

fileInput.addEventListener("change", () => {
    fileManager.addFile();
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


