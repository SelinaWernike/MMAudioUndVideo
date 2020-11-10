export default class VideoLoader {
    loadVideo(file) {
        let video = document.createElement("video");
        video.src = file;
        return video;
    }
}