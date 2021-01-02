export default class VideoController {

    static JUMP_TIME_SECONDS = 5

    constructor(fileManager, trackController, video = document.querySelector("#video"), onFinalEnd) {
        this.fileManager = fileManager;
        this.trackController = trackController;
        this.video = video;
        this.onFinalEnd = onFinalEnd;
        this.looping = false
        this.previousVolume = video.volume
        this.userControlled = false;
        video.addEventListener("ended", this.onEnded.bind(this));
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
        window.onToStartClick = this.onToStartClick.bind(this, false)
        window.onToEndClick = this.onToEndClick.bind(this, true)
        window.onRewindClick = this.onRewindClick.bind(this)
        window.onForwardClick = this.onForwardClick.bind(this)
        window.onVideoVolumeOnClick = this.onVolumeClick.bind(this);
        window.onVideoVolumeOffClick = this.onVolumeOffClick.bind(this);
        window.onVideoVolumeChange = (event) => this.changeVolume(event.target.value);
        window.onLoopClick = this.onLoopClick.bind(this)
        return this;
    }

    onUpdate() {
        if (this.video.currentTime > this.video.endTime) {
            this.video.pause();
            this.onEnded();
        }
    }

    onPlayClick() {
        if (this.video.src === '') {
            const nextKey = this.trackController.getNextVideo()
            if (nextKey) {
                this.changeVideoSource(nextKey)
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

    onEnded(forcePause) {
        const nextKey = this.trackController.getNextVideo()
        if (nextKey) {
            this.changeVideoSource(nextKey)
            this.video.play()
        } else {
            this.changeVideoSource(this.trackController.getFirstVideo())
            if (!forcePause && this.looping) {
                this.video.play()
            } else {
                if (this.onFinalEnd) {
                    this.onFinalEnd();
                }
                if (this.userControlled) {
                    this.pauseIcon.setAttribute("hidden", "")
                    this.playIcon.removeAttribute("hidden")
                }
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
            const wasPlaying = !this.video.paused
            this.video.pause()
            this.changeVideoSource(this.trackController.getFirstVideo())
            if (wasPlaying) {
                this.video.play()
            }
        }
    }

    onToEndClick() {
        if (this.video.src !== "") {
            const wasPlaying = !this.video.paused
            this.video.pause()
            this.changeVideoSource(this.trackController.getLastVideo())
            this.onEnded(!wasPlaying);
        }
    }

    onRewindClick() {
        if (this.video.src !== "") {
            const overhang = this.video.startTime - this.video.currentTime - VideoController.JUMP_TIME_SECONDS
            if (overhang < 0) {
                const previousKey = this.trackController.getPreviousVideo()
                if (previousKey) {
                    const wasPlaying = !this.video.paused
                    this.video.pause()
                    this.changeVideoSource(previousKey)
                    this.video.currentTime = this.video.endTime + overhang
                    if (wasPlaying) {
                        this.video.play()
                    }
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
                    const wasPlaying = !this.video.paused
                    this.video.pause()
                    this.changeVideoSource(nextKey)
                    this.video.currentTime = this.video.startTime + overhang
                    if (wasPlaying) {
                        video.play()
                    }
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

    changeVideoSource(data) {
        const url = this.fileManager.fileMap.get(data.fileKey);
        this.video.startTime = data.startTime;
        this.video.endTime = data.startTime + data.duration;
        if (this.video.src !== url) {
            this.video.src = url
            this.video.load()
        }
        this.video.currentTime = data.startTime;
    }

    setCurrentTime(time){
        console.log(time);
        this.video.currentTime = time;
    }
}
