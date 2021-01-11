export default class AudioController {

    constructor(fileManager, trackController) {
        this.fileManager = fileManager;
        this.trackController = trackController;
        this.audio = document.querySelector("#audio")
        this.video = document.querySelector("#video")
        this.volumeOnIcon = document.querySelector("#audioVolumeOnIcon")
        this.volumeOffIcon = document.querySelector("#audioVolumeOffIcon")
        this.volumeSlider = document.querySelector("#audioVolumeSlider")
        this.previousVolume = this.audio.volume
        this.changeVolume(this.volumeSlider.value)
        this.audio.addEventListener("timeupdate", this.onUpdate.bind(this));
        this.audio.addEventListener("ended", this.onEnded.bind(this));
        this.video.addEventListener("play", this.onPlayClick.bind(this));
        this.video.addEventListener("pause", () => this.audio.pause());
        this.video.addEventListener("trackEnded", () => {
            this.audio.removeAttribute("src")
            this.audio.load()
        });
        this.video.addEventListener("seeked", this.onVideoSeek.bind(this));
        window.onAudioVolumeOnClick = this.onVolumeClick.bind(this);
        window.onAudioVolumeOffClick = this.onVolumeOffClick.bind(this);
        window.onAudioVolumeChange = (event) => this.changeVolume(event.target.value);
    }

    onUpdate() {
        if (this.audio.currentTime > this.audio.endTime) {
            this.onEnded();
        }
    }

    onPlayClick() {
        if (this.audio.src === "") {
            const data = this.trackController.getCurrentAudio()
            if (data) {
                this.changeSource(data)
            }
        }
        if (this.audio.src !== "") {
            this.audio.play()
        }
    }

    onEnded() {
        const data = this.trackController.getNextAudio()
        if (data) {
            this.changeSource(data, true)
        } else {
            this.audio.removeAttribute("src")
            this.audio.load()
        }
    }

    onVideoSeek() {
        const data = this.trackController.getCurrentAudio()
        if (data) {
            this.changeSource(data)
        } else {
            this.audio.removeAttribute("src")
            this.audio.load()
        }
    }

    onVolumeClick() {
        this.previousVolume = this.audio.volume
        this.volumeSlider.value = 0
        this.changeVolume(0)
    }

    onVolumeOffClick() {
        this.volumeSlider.value = this.previousVolume
        this.changeVolume(this.previousVolume)
    }

    changeVolume(volume) {
        if (volume == 0) {
            this.volumeOnIcon.setAttribute("hidden", "")
            this.volumeOffIcon.removeAttribute("hidden")
        } else {
            this.volumeOffIcon.setAttribute("hidden", "")
            this.volumeOnIcon.removeAttribute("hidden")
        }
        this.audio.volume = volume
    }

    changeSource(data, forcePlay) {
        const wasPlaying = !this.video.paused
        this.audio.pause();
        const url = this.fileManager.fileMap.get(data.fileKey);
        this.audio.startTime = data.startTime;
        this.audio.endTime = data.startTime + data.duration;
        if (this.audio.src !== url) {
            this.audio.src = url
            this.audio.load()
        }
        this.audio.currentTime = data.time || data.startTime;
        if (forcePlay || wasPlaying) {
            this.audio.play();
        }
    }
}
