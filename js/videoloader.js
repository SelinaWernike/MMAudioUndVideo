export default class VideoLoader {
constructor(fileManager) {
    this.fileManager = fileManager;
}

    load(fileKey) {
        let video = document.createElement("video");
        let src = this.fileManager.fileMap.get(fileKey);
        if(src.startsWith("data:video")) {
            video.src = src;
            return video;
        } else {
            return null;
        }
    }

    getDuration(video) {
        video.load();
        return video.duration;
    }
}