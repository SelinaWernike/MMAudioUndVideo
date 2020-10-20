import FilterManager from "./filterManager.js"

let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let video = document.querySelector("video")
let filterManager = new FilterManager()
resizeCanvas()

video.addEventListener("play", () => {
    requestAnimationFrame(render)
})

window.addEventListener("resize", () => {
    resizeCanvas()
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
