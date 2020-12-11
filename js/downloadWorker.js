import VideoController from "./videoController.js"
import FilterManager from "./filterManager.js"
import FileManager from "./fileManager.js"
import EditManager from "./editManager.js"
import TrackController from "./trackController.js"

// this is not an actual Web Worker since they do not work with modules (except in Chrome)
// that means we have access to the DOM and references to other objects and have to be careful 
// about not changing stuff and not creating any noise or visual output
export default class RenderToFile {

    constructor(width, height, fileManager, filterManager, videoManager, effectManager) {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        fileManager = FileManager.fromCopy(Object.assign({}, fileManager));
        filterManager = new FilterManager();
        videoManager = EditManager.fromCopy(Object.assign({}, videoManager));
        effectManager = EditManager.fromCopy(Object.assign({}, effectManager));
        const trackController = new TrackController(videoManager, null, effectManager);
        trackController.setEndTime(false);
        const video = document.createElement("video");
        video.muted = true;
        video.addEventListener("play", renderVideo);
        const recorder = new MediaRecorder(canvas.captureStream());
        recorder.addEventListener("dataavailable", event => {
            this.resolve(URL.createObjectURL(event.data))
        })
        new VideoController(fileManager, trackController, video, recorder.stop.bind(recorder)).onPlayClick();
        recorder.start();
        const promise = new Promise(resolve => {
            this.resolve = resolve;
        });
        promise.__proto__.getProgress = function () {
            return 100 * (trackController.getCurrentTime(video) / trackController.endTime);
        }
        return promise;

        function renderVideo() {
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            const currentFilter = trackController.getCurrentFilter(video);
            if (currentFilter) {
                const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height)
                filterManager.apply(currentFrame, currentFilter)
                context.putImageData(currentFrame, 0, 0)
            }
            requestAnimationFrame(renderVideo)
        }
    }
}
