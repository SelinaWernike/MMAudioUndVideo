export default class AudioLoader {

    constructor(fileManager) {
        this.fileManager = fileManager;
    }
    load(fileKey) {
        let audio = document.createElement("audio")
        audio.onerror=function() {
            return null;
        }
        let src = this.fileManager.fileMap.get(fileKey);
        if(src.startsWith("data:audio")) {
        audio.src = src;

        return audio;
        } else {
            return null;
        }
    }

    getDuration(audio) {
        return audio.duration;
    }
}