export default class AudioLoader {

    loadAudio(file) {
        let audio = document.createElement("audio")
        audio.src = file;
        return audio;
    }
}