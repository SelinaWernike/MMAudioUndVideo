import VideoController from "./videoController.js"
import AudioController from "./audioController.js"
import FilterManager from "./filterManager.js"
import FileManager from "./fileManager.js"
import EditManager from "./editManager.js"
import DownloadManager from "./downloadManager.js";
import SettingsManager from "./settingsManager.js";
import AudioLoader from "./audioloader.js"
import VideoLoader from "./videoloader.js"
import EffectLoader from "./effectLoader.js"
import TrackController from "./trackController.js"

let canvas = document.querySelector("#canvas")
let context = canvas.getContext("2d")
let video = document.querySelector("#video")
let bgImage = document.querySelector("#backgroundImgCanvas")
let fileInput = document.querySelector("#fileInput");
let filterManager = new FilterManager().fillHtmlFilterList();
let fileManager = new FileManager()
let videoManager = new EditManager("videotrack", new VideoLoader(fileManager), false)
let audioManager = new EditManager("audiotrack", new AudioLoader(fileManager), false)
const effectLoader = new EffectLoader(filterManager);
let effectManager = new EditManager("effecttrack", effectLoader, true)
const trackController = new TrackController(videoManager, audioManager, effectManager);
effectLoader.setTrackManager(trackController);
const videoController = new VideoController(fileManager, trackController).addWindowListener();
const audioController = new AudioController(fileManager, trackController)
let settingsManager = new SettingsManager(trackController);
const downloadManager = new DownloadManager(fileManager, filterManager, videoManager, effectManager);
resizeCanvas()

videoManager.initializeTrack(videoController);
audioManager.initializeTrack(audioController);
effectManager.initializeTrack();

//Add Event Listener
document.querySelector("#videotrack").addEventListener("trackChange", function () {
    trackController.setEndTime();
    trackController.setTrackLength();
    videoController.reset();
});

document.querySelector("#audiotrack").addEventListener("trackChange", function () {
    videoController.reset();
})

video.addEventListener("play", () => {
    requestAnimationFrame(renderVideo)
})

video.addEventListener("seeked", () => {
    renderCurrentFrame()
})

video.addEventListener("trackEmpty", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
})

window.addEventListener("resize", () => {
    resizeCanvas()
})

fileInput.addEventListener("change", () => {
    fileManager.addFiles(fileInput.files);
})

function resizeCanvas() {
    canvas.width = canvas.parentNode.clientWidth;
    canvas.height = canvas.parentNode.clientHeight;
    bgImage.width = canvas.width;
    bgImage.height = canvas.height;
}

function renderVideo() {
    if (!video.paused && !video.ended) {
        renderCurrentFrame()
        requestAnimationFrame(renderVideo)
    }
}

function renderCurrentFrame() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const currentFilter = trackController.getCurrentFilter();
    if (currentFilter) {
        let currentFrame = context.getImageData(0, 0, canvas.width, canvas.height)
        filterManager.apply(currentFrame, currentFilter)
        context.putImageData(currentFrame, 0, 0)
    }
}
