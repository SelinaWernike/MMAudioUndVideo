export default class VideoController {

    static JUMP_TIME_SECONDS = 5

    constructor(fileManager, trackController) {
        const video = document.querySelector("#video")
        const playIcon = document.querySelector("#playIcon")
        const pauseIcon = document.querySelector("#pauseIcon")
        const volumeOnIcon = document.querySelector("#volumeOnIcon")
        const volumeOffIcon = document.querySelector("#volumeOffIcon")
        const volumeSlider = document.querySelector("#volumeSlider")
        const loopIcon = document.querySelector("#loopIcon")
        const noLoopIcon = document.querySelector("#noLoopIcon")
        changeVolume(volumeSlider.value)
        let previousVolume = video.volume
        let looping = false

        video.addEventListener("ended", () => {
            const nextKey = trackController.getNextVideo()
            if (nextKey) {
                changeVideoSource(nextKey)
                video.play()
            } else {
                changeVideoSource(trackController.getFirstVideo())
                if (looping) {
                    video.play()
                } else {
                    pauseIcon.setAttribute("hidden", "")
                    playIcon.removeAttribute("hidden")
                }
            }
        })

        window.onPlayClick = function() {
            if (video.src === '') {
                const nextKey = trackController.getNextVideo()
                if (nextKey) {
                    changeVideoSource(nextKey)
                }
            }
            if (video.src !== '') {
                video.play()
                playIcon.setAttribute("hidden", "")
                pauseIcon.removeAttribute("hidden")
            }
        }

        window.onPauseClick = function() {
            video.pause()
            pauseIcon.setAttribute("hidden", "")
            playIcon.removeAttribute("hidden")
        }

        window.onToStartClick = function() {
            if (video.src !== "") {
                const wasPlaying = !video.paused
                video.pause()
                changeVideoSource(trackController.getFirstVideo())
                video.currentTime = 0
                if (wasPlaying) {
                    video.play()
                }
            }
        }

        window.onToEndClick = function() {
            if (video.src !== "") {
                video.pause()
                if (changeVideoSource(trackController.getLastVideo())) {
                    // metadata (duration) might not be loaded yet after change of source
                    video.addEventListener("loadedmetadata", jumpToLastFrame)
                } else {
                    jumpToLastFrame()
                }
            }
        }

        function jumpToLastFrame() {
            video.removeEventListener("loadedmetadata", jumpToLastFrame)
            video.currentTime = video.duration
        }

        let rewindFunction
        window.onRewindClick = function() {
            if (video.src !== "") {
                const overhang = video.currentTime - VideoController.JUMP_TIME_SECONDS
                if (overhang < 0) {
                    const previousKey = trackController.getPreviousVideo()
                    if (previousKey) {
                        const wasPlaying = !video.paused
                        video.pause()
                        changeVideoSource(previousKey)
                        rewindFunction = () => jumpToFrameFromEnd(overhang, wasPlaying)
                        // metadata (duration) might not be loaded yet after change of source
                        video.addEventListener("loadedmetadata", rewindFunction)
                    } else {
                        video.currentTime = 0
                    }
                } else {
                    video.currentTime = overhang
                }
            }
        }

        function jumpToFrameFromEnd(overhang, wasPlaying) {
            video.removeEventListener("loadedmetadata", rewindFunction)
            video.currentTime = video.duration + overhang
            if (wasPlaying) {
                video.play()
            }
        }

        window.onForwardClick = function() {
            if (video.src !== "") {
                const overhang = video.duration - video.currentTime - VideoController.JUMP_TIME_SECONDS
                if (overhang < 0) {
                    const nextKey = trackController.getNextVideo();
                    if (nextKey) {
                        const wasPlaying = !video.paused
                        video.pause()
                        changeVideoSource(nextKey)
                        video.currentTime = -overhang
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

        window.onLoopClick = function() {
            looping = !looping
            if (looping) {
                noLoopIcon.setAttribute("hidden", "")
                loopIcon.removeAttribute("hidden")
            } else {
                loopIcon.setAttribute("hidden", "")
                noLoopIcon.removeAttribute("hidden")
            }
        }

        window.onVolumeOnClick = function() {
            previousVolume = video.volume
            volumeSlider.value = 0
            changeVolume(0)
        }

        window.onVolumeOffClick = function() {
            volumeSlider.value = previousVolume
            changeVolume(previousVolume)
        }

        window.onVolumeChange = function(event) {
            changeVolume(event.target.value)
        }

        function changeVideoSource(fileKey) {
            const url = fileManager.fileMap.get(fileKey);
            if (video.src !== url) {
                video.src = url
                video.load()
                return true
            }
            return false
        }

        function changeVolume(volume) {
            if (volume == 0) {
                volumeOnIcon.setAttribute("hidden", "")
                volumeOffIcon.removeAttribute("hidden")
            } else {
                volumeOffIcon.setAttribute("hidden", "")
                volumeOnIcon.removeAttribute("hidden")
            }
            video.volume = volume
        }
    }
}