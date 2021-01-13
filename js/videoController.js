export default class VideoController {

    static JUMP_TIME_SECONDS = 5

    constructor(fileManager, trackController, video = document.querySelector("#video")) {
        this.fileManager = fileManager;
        this.trackController = trackController;
        this.video = video;
        this.looping = false
        this.previousVolume = video.volume
        this.userControlled = false;
        video.addEventListener("ended", this.onEnded.bind(this, false));
        video.addEventListener("timeupdate", this.onUpdate.bind(this));
    }

    addWindowListener() {
        this.userControlled = true;
        this.playIcon = document.querySelector("#playIcon")
        this.pauseIcon = document.querySelector("#pauseIcon")
        this.loopIcon = document.querySelector("#loopIcon")
        this.noLoopIcon = document.querySelector("#noLoopIcon")
        this.volumeOnIcon = document.querySelector("#videoVolumeOnIcon")
        this.volumeOffIcon = document.querySelector("#videoVolumeOffIcon")
        this.volumeSlider = document.querySelector("#videoVolumeSlider")
        this.changeVolume(this.volumeSlider.value)
        window.onPlayClick = this.onPlayClick.bind(this)
        window.onPauseClick = this.onPauseClick.bind(this)
        window.onToStartClick = this.onToStartClick.bind(this)
        window.onToPreviousClick = this.onToPreviousClick.bind(this)
        window.onToNextClick = this.onToNextClick.bind(this)
        window.onRewindClick = this.onRewindClick.bind(this)
        window.onForwardClick = this.onForwardClick.bind(this)
        window.onVideoVolumeOnClick = this.onVolumeClick.bind(this);
        window.onVideoVolumeOffClick = this.onVolumeOffClick.bind(this);
        window.onVideoVolumeChange = (event) => this.changeVolume(event.target.value);
        window.onLoopClick = this.onLoopClick.bind(this)
        return this;
    }

    reset() {
        const nextKey = this.trackController.getFirstVideo();
        if (nextKey) {
            this.changeSource(nextKey)
            this.video.dispatchEvent(new Event("seeked"))
        } else {
            this.video.removeAttribute("src")
            this.video.load()
            this.video.dispatchEvent(new Event("trackEmpty"))
            this.onPauseClick()
        }
    }

    onUpdate() {
        if (this.video.currentTime > this.video.endTime) {
            this.onEnded();
        }
    }

    onPlayClick() {
        if (this.video.src === '') {
            const nextKey = this.trackController.getNextVideo()
            if (nextKey) {
                this.changeSource(nextKey)
            }
        }
        if (this.video.src !== '') {
            this.video.play()
            if (this.userControlled) {
                this.playIcon.setAttribute("hidden", "")
                this.pauseIcon.removeAttribute("hidden")
            }
        }
    }

    onEnded(forceEnd) {
        const nextKey = this.trackController.getNextVideo()
        if (nextKey && !forceEnd) {
            this.changeSource(nextKey, true)
        } else {
            this.video.dispatchEvent(new Event("trackEnded"));
            this.changeSource(this.trackController.getFirstVideo(), !forceEnd && this.looping, forceEnd || !this.looping)
            if (this.video.paused && this.userControlled) {
                this.pauseIcon.setAttribute("hidden", "")
                this.playIcon.removeAttribute("hidden")
            }
        }
    }

    onPauseClick() {
        this.video.pause()
        if (this.userControlled) {
            this.pauseIcon.setAttribute("hidden", "")
            this.playIcon.removeAttribute("hidden")
        }
    }

    onToStartClick() {
        if (this.video.src !== "") {
            this.onEnded(true)
        }
    }

    onToPreviousClick() {
        if (this.video.src !== "") {
            const previous = this.trackController.getPreviousVideo();
            if (previous) {
                this.changeSource(previous)
                this.video.dispatchEvent(new Event("seeked"))
            } else {
                this.video.currentTime = 0;
            }
        }
    }

    onToNextClick() {
        if (this.video.src !== "") {
            const next = this.trackController.getNextVideo()
            if (next) {
                this.changeSource(next)
                this.video.dispatchEvent(new Event("seeked"))
            } else {
                this.onEnded(this.video.paused);
            }
        }
    }

    onRewindClick() {
        if (this.video.src !== "") {
            const overhang = this.video.currentTime - this.video.startTime - VideoController.JUMP_TIME_SECONDS
            if (overhang < 0) {
                const previousKey = this.trackController.getPreviousVideo()
                if (previousKey) {
                    this.changeSource(previousKey)
                    this.video.currentTime = this.video.endTime + overhang;
                } else {
                    this.video.currentTime = this.video.startTime
                }
            } else {
                this.video.currentTime = overhang
            }
        }
    }

    onForwardClick() {
        if (this.video.src !== "") {
            const overhang = this.video.endTime - this.video.currentTime - VideoController.JUMP_TIME_SECONDS
            if (overhang < 0) {
                const nextKey = this.trackController.getNextVideo();
                if (nextKey) {
                    this.changeSource(nextKey)
                    this.video.currentTime = this.video.startTime + overhang;
                } else {
                    video.currentTime = this.video.endTime;
                }
            } else {
                video.currentTime += VideoController.JUMP_TIME_SECONDS
            }
        }
    }

    onVolumeClick() {
        this.previousVolume = this.video.volume
        this.volumeSlider.value = 0
        this.changeVolume(0)
    }

    onVolumeOffClick() {
        this.volumeSlider.value = this.previousVolume
        this.changeVolume(this.previousVolume)
    }

    onLoopClick() {
        this.looping = !this.looping
        if (this.userControlled) {
            if (this.looping) {
                this.noLoopIcon.setAttribute("hidden", "")
                this.loopIcon.removeAttribute("hidden")
            } else {
                this.loopIcon.setAttribute("hidden", "")
                this.noLoopIcon.removeAttribute("hidden")
            }
        }
    }

    changeVolume(volume) {
        this.video.volume = volume
        if (this.userControlled) {
            if (volume == 0) {
                this.volumeOnIcon.setAttribute("hidden", "")
                this.volumeOffIcon.removeAttribute("hidden")
            } else {
                this.volumeOffIcon.setAttribute("hidden", "")
                this.volumeOnIcon.removeAttribute("hidden")
            }
        }
    }

    changeSource(data, forcePlay, forcePause) {
        const wasPlaying = !this.video.paused
        this.video.pause();
        const url = this.fileManager.fileMap.get(data.fileKey);
        this.video.startTime = data.startTime;
        this.video.endTime = data.startTime + data.duration;
        if (this.video.src !== url) {
            this.video.src = url
            this.video.load()            
        }
        this.video.currentTime = data.time || data.startTime;
        if (forcePlay || wasPlaying && !forcePause) {
            this.video.play();
        }
    }
}
