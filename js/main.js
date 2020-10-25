import FilterManager from "./filterManager.js"
import FileManager from "./fileManager.js"

let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let video = document.querySelector("video")
let input = document.querySelector('input');
input.style.opacity = '0';
let filterManager = new FilterManager()
let fileManager = new FileManager()
resizeCanvas()

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
