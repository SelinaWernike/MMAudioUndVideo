export default class AudioController {

    constructor(fileManager, trackController) {
        const audio = document.querySelector("#audio")
        const video = document.querySelector("#video")

        audio.addEventListener("ended", () => {
            const url = trackController.getNextAudio()
            if (url) {
                changeAudioSource(url)
                audio.play()
            } else {
                audio.removeAttribute("src")
            }
        })

        video.addEventListener("play", () => {
            if (audio.src === "") {
                const { url, time } = trackController.getCurrentAudio()
                if (url) {
                    changeAudioSource(url)
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
            const { url, time } = trackController.getCurrentAudio()
            if (url) {
                if (audio.src !== url) {
                    const wasPlaying = !audio.paused
                    audio.pause()
                    changeAudioSource(url)
                    audio.currentTime = time
                    if (wasPlaying) {
                        audio.play()
                    }
                } else {
                    audio.currentTime = time
                }
            }
        })

        function changeAudioSource(fileKey) {
            const url = fileManager.fileMap.get(fileKey);
            if (audio.src !== url) {
                audio.src = url
                audio.load()
                return true
            }
            return false
        }
    }
}