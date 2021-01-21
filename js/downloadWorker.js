import VideoController from "./videoController.js"
import FileManager from "./fileManager.js"
import EditManager from "./editManager.js"
import TrackController from "./trackController.js"

// this is not an actual Web Worker since they do not work with modules (except in Chrome)
// that means we have access to the DOM and references to other objects and have to be careful 
// about not changing stuff and not creating any noise or visual output
export default class RenderToFile {

    constructor(width, height, fileManager, filterManager, videoManager, effectManager) {
        const bgImage = getBackgroundImage(width, height)
        const canvas = document.createElement("canvas")
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        const tmpCanvas = document.createElement("canvas")
        tmpCanvas.width = width;
        tmpCanvas.height = height;
        const tmpContext = tmpCanvas.getContext("2d")
        fileManager = FileManager.fromCopy(Object.assign({}, fileManager));
        videoManager = EditManager.fromCopy(Object.assign({}, videoManager));
        effectManager = EditManager.fromCopy(Object.assign({}, effectManager));
        const trackController = new TrackController(videoManager, null, effectManager, false);
        trackController.setEndTime(false);
        const video = document.createElement("video");
        video.muted = true;
        video.addEventListener("play", renderVideo);
        const recorder = new MediaRecorder(canvas.captureStream());
        recorder.addEventListener("dataavailable", event => {
            this.resolve(URL.createObjectURL(event.data))
        })
        video.addEventListener("trackEnded", recorder.stop.bind(recorder));
        new VideoController(fileManager, trackController, video).onPlayClick();
        recorder.start();
        const promise = new Promise(resolve => {
            this.resolve = resolve;
        });
        promise.__proto__.getProgress = function () {
            return 100 * (trackController.getCurrentTime(video) / trackController.endTime);
        }
        return promise;

        function getBackgroundImage(width, height) {
            let bgImage = document.querySelector("#backgroundImgCanvas")
            if (bgImage.src) {
                const newImage = document.createElement("img");
                newImage.src = bgImage.src;
                bgImage = newImage;
                bgImage.width = width;
                bgImage.height = height;
            }
            return bgImage
        }

        function renderVideo() {
            if (!video.paused && !video.ended) {
                const currentFilter = trackController.getCurrentFilter(video);
                if (currentFilter) {
                    if (bgImage.src) {
                        // if we have a background image, we have to draw both to the recorded canvas
                        // putImageData replaces everything, so we have to use it on a second canvas
                        tmpContext.drawImage(video, 0, 0, tmpCanvas.width, tmpCanvas.height)
                        const currentFrame = tmpContext.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height)
                        filterManager.apply(currentFrame, currentFilter)
                        tmpContext.putImageData(currentFrame, 0, 0)
                        context.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
                        context.drawImage(tmpCanvas, 0, 0, canvas.width, canvas.height)
                    } else {
                        context.drawImage(video, 0, 0, canvas.width, canvas.height)
                        const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height)
                        filterManager.apply(currentFrame, currentFilter)
                        context.putImageData(currentFrame, 0, 0)
                    }
                } else {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height)
                }
                requestAnimationFrame(renderVideo)
            }
        }
    }
}
