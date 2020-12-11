export default class AudioController {

    constructor(fileManager, trackController) {
        const audio = document.querySelector("#audio")
        const video = document.querySelector("#video")
        const volumeOnIcon = document.querySelector("#audioVolumeOnIcon")
        const volumeOffIcon = document.querySelector("#audioVolumeOffIcon")
        const volumeSlider = document.querySelector("#audioVolumeSlider")
        changeVolume(volumeSlider.value)
        let previousVolume = audio.volume

        audio.addEventListener("ended", () => {
            const nextKey = trackController.getNextAudio()
            if (nextKey) {
                changeAudioSource(nextKey)
                audio.play()
            } else {
                audio.removeAttribute("src")
            }
        })

        video.addEventListener("play", () => {
            if (audio.src === "") {
                const { fileKey, time } = trackController.getCurrentAudio()
                if (fileKey) {
                    changeAudioSource(fileKey)
                    audio.currentTime = time
                }
            }
            if (audio.src !== "") {
                audio.play()
            }
        })

        video.addEventListener("pause", () => {
            audio.pause()
        })

        video.addEventListener("seeked", () => {
            const { fileKey, time } = trackController.getCurrentAudio()
            if (fileKey) {
                const wasPlaying = !video.paused
                audio.pause()
                changeAudioSource(fileKey)
                audio.currentTime = time
                if (wasPlaying) {
                    audio.play()
                }
            }
        })

        window.onAudioVolumeOnClick = function() {
            previousVolume = audio.volume
            volumeSlider.value = 0
            changeVolume(0)
        }

        window.onAudioVolumeOffClick = function() {
            volumeSlider.value = previousVolume
            changeVolume(previousVolume)
        }

        window.onAudioVolumeChange = function(event) {
            changeVolume(event.target.value)
        }

        function changeAudioSource(fileKey) {
            const url = fileManager.fileMap.get(fileKey);
            if (audio.src !== url) {
                audio.src = url
                audio.load()
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
            audio.volume = volume
        }
    }
}
