export default class VideoLoader {
    
    constructor(fileManager) {
        this.fileManager = fileManager;
    }

    load(fileKey, element, editManager) {
        let video = document.createElement("video");
        let src = this.fileManager.fileMap.get(fileKey);
        if (src && src.startsWith("data:video")) {
            video.src = src;
            video.load();
            video.addEventListener("loadedmetadata", function(event) {editManager.setItemDuration(video,element.id);});
            return video;
        } else {
            return null;
        }
    }
}