export default class AudioLoader {

    constructor(fileManager) {
        this.fileManager = fileManager;
    }
    
    load(fileKey, element, editManager) {
        let audio = document.createElement("audio")
        let src = this.fileManager.fileMap.get(fileKey);
        if (src && src.startsWith("data:audio")) {
            audio.src = src;
            audio.load();
            audio.addEventListener("loadedmetadata", function(event) {editManager.setItemDuration(audio, element.id);});
            return audio;
        } else {
            return null;
        }
    }
}