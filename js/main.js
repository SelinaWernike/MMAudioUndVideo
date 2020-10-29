import FilterManager from "./filterManager.js"
import FileManager from "./fileManager.js"

let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let video = document.querySelector("video")
let input = document.querySelector('input');
input.style.opacity = '0';
let listElements = document.querySelectorAll("li")
let items = document.querySelectorAll(".item1, .item2, .item3")
let deleteEdit = document.querySelector("#delete")
let filterManager = new FilterManager()
let fileManager = new FileManager()
resizeCanvas()

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
