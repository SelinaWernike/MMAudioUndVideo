import FilterManager from "./filterManager.js"
import FileManager from "./fileManager.js"
import EditManager from "./editManager.js"



let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let video = document.querySelector("video")
let input = document.querySelector('input');
input.style.opacity = '0';
let deleteEdit = document.querySelector("#delete")
let filterManager = new FilterManager()
let fileManager = new FileManager()
let videoManager = new EditManager("videogrid", "videotrack", "mp4")
let audioManager = new EditManager("audiogrid", "audiotrack", "mp3")
let effectManager = new EditManager("effectgrid", "effecttrack", "effect")
resizeCanvas()

videoManager.initializeTrack();
audioManager.initializeTrack();
effectManager.initializeTrack();
//Add Event Listener
video.addEventListener("play", () => {
    requestAnimationFrame(render)
})

window.addEventListener("resize", () => {
    resizeCanvas()
})

input.addEventListener("change", () => {
    fileManager.addFile();
})





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

function render() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    let currentFrame = context.getImageData(0, 0, canvas.width, canvas.height)
    let newFrame = filterManager.apply(currentFrame)
    context.putImageData(newFrame, 0, 0)
    requestAnimationFrame(render)
}
