export default class VideoController {

    static JUMP_TIME_SECONDS = 5

    constructor(fileManager, videoManager) {
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
        let currentVideoIndex = -1
        let looping = false;

        video.addEventListener("ended", () => {
            if (currentVideoIndex >= videoManager.fileKeys.length - 1) {
                changeCurrentVideoSource(0)
                if (looping) {
                    video.play()
                } else {
                    pauseIcon.setAttribute("hidden", "")
                    playIcon.removeAttribute("hidden")
                }
            } else {
                changeCurrentVideoSource(currentVideoIndex + 1)
                video.play()
            }
        })

        window.onPlayClick = function() {
            if (video.src === '' && videoManager.fileKeys.length !== 0) {
                changeCurrentVideoSource(0)
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
                changeCurrentVideoSource(0)
                video.currentTime = 0
                if (wasPlaying) {
                    video.play()
                }
            }
        }

        window.onToEndClick = function() {
            if (video.src !== "") {
                video.pause()
                if (changeCurrentVideoSource(videoManager.fileKeys.length - 1)) {
                    // metadata (duration) might not be loaded yet after change of source
                    video.addEventListener("loadedmetadata", jumpToLastFrame)
                } else {
                    jumpToLastFrame()
                }
            }
        }

        function jumpToLastFrame() {
            video.removeEventListener("loadedmetadata", jumpToLastFrame)
            video.currentTime = video.duration;
        }

        let rewindFunction;
        window.onRewindClick = function() {
            if (video.src !== "") {
                const overhang = video.currentTime - VideoController.JUMP_TIME_SECONDS
                if (overhang < 0 && currentVideoIndex !== 0) {
                    const wasPlaying = !video.paused
                    video.pause()
                    if (changeCurrentVideoSource(currentVideoIndex - 1)) {
                        rewindFunction = () => jumpToFrameFromEnd(overhang, wasPlaying)
                        // metadata (duration) might not be loaded yet after change of source
                        video.addEventListener("loadedmetadata", rewindFunction)
                    } else {
                        jumpToFrameFromEnd(overhang, wasPlaying)
                    }
                } else {
                    video.currentTime = overhang
                }
            }
        }

        function jumpToFrameFromEnd(overhang, wasPlaying) {
            video.removeEventListener("loadedmetadata", rewindFunction)
            video.currentTime = video.duration + overhang;
            if (wasPlaying) {
                video.play()
            }
        }

        window.onForwardClick = function() {
            if (video.src !== "") {
                const overhang = video.duration - video.currentTime - VideoController.JUMP_TIME_SECONDS
                if (overhang < 0 && currentVideoIndex !== videoManager.fileKeys.length - 1) {
                    const wasPlaying = !video.paused
                    video.pause()
                    changeCurrentVideoSource(currentVideoIndex + 1)
                    video.currentTime = -overhang;
                    if (wasPlaying) {
                        video.play()
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

        function changeCurrentVideoSource(index) {
            if (currentVideoIndex != index) {
                currentVideoIndex = index
                const fileKey = videoManager.fileKeys[currentVideoIndex]
                video.src = fileManager.fileMap.get(fileKey)
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
