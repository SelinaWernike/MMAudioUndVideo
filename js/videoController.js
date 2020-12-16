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
        window.onToEndClick = this.onToEndClick.bind(this)
        window.onRewindClick = this.onRewindClick.bind(this)
        window.onForwardClick = this.onForwardClick.bind(this)
        window.onVideoVolumeOnClick = this.onVolumeClick.bind(this);
        window.onVideoVolumeOffClick = this.onVolumeOffClick.bind(this);
        window.onVideoVolumeChange = (event) => this.changeVolume(event.target.value);
        window.onLoopClick = this.onLoopClick.bind(this)
        return this;
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

    onEnded() {
        const nextKey = this.trackController.getNextVideo()
        if (nextKey) {
            this.changeVideoSource(nextKey)
            this.video.play()
        } else {
            this.changeVideoSource(this.trackController.getFirstVideo())
            if (this.looping) {
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
            this.video.currentTime = 0
            if (wasPlaying) {
                this.video.play()
            }
        }
    }

    onToEndClick() {
        if (this.video.src !== "") {
            this.video.pause()
            if (this.changeVideoSource(this.trackController.getLastVideo())) {
                // metadata (duration) might not be loaded yet after change of source
                this.video.addEventListener("loadedmetadata", this.jumpToLastFrame)
            } else {
                this.jumpToLastFrame()
            }
        }
    }

    onRewindClick() {
        if (this.video.src !== "") {
            const overhang = this.video.currentTime - VideoController.JUMP_TIME_SECONDS
            if (overhang < 0) {
                const previousKey = this.trackController.getPreviousVideo()
                if (previousKey) {
                    const wasPlaying = !this.video.paused
                    this.video.pause()
                    this.changeVideoSource(previousKey)
                    this.rewindFunction = () => this.jumpToFrameFromEnd(overhang, wasPlaying)
                    // metadata (duration) might not be loaded yet after change of source
                    this.video.addEventListener("loadedmetadata", this.rewindFunction)
                } else {
                    this.video.currentTime = 0
                }
            } else {
                this.video.currentTime = overhang
            }
        }
    }

    onForwardClick() {
        if (this.video.src !== "") {
            const overhang = this.video.duration - this.video.currentTime - VideoController.JUMP_TIME_SECONDS
            if (overhang < 0) {
                const nextKey = this.trackController.getNextVideo();
                if (nextKey) {
                    const wasPlaying = !this.video.paused
                    this.video.pause()
                    this.changeVideoSource(nextKey)
                    this.video.currentTime = -overhang
                    if (wasPlaying) {
                        video.play()
                    }
                } else {
                    video.currentTime = video.duration;
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

    changeVideoSource(fileKey) {
        const url = this.fileManager.fileMap.get(fileKey);
        if (this.video.src !== url) {
            this.video.src = url
            this.video.load()
            return true
        }
        return false
    }

    jumpToLastFrame() {
        this.video.removeEventListener("loadedmetadata", this.jumpToLastFrame)
        this.video.currentTime = this.video.duration
    }

    jumpToFrameFromEnd(overhang, wasPlaying) {
        this.video.removeEventListener("loadedmetadata", this.rewindFunction)
        this.video.currentTime = this.video.duration + overhang
        if (wasPlaying) {
            this.video.play()
        }
    }
}
