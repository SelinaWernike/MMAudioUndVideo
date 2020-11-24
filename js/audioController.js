export default class AudioController {

    constructor(trackController) {
        const audio = document.querySelector("#audio")
        const video = document.querySelector("#video")

        audio.addEventListener("ended", () => {
            const url = trackController.getNextAudio()
            if (url) {
                if (audio.src !== url) {
                    audio.src = url
                    audio.load()
                }
                audio.play()
            } else {
                audio.removeAttribute("src")
            }
        })

        video.addEventListener("play", () => {
            if (audio.src === "") {
                const { url, time } = trackController.getCurrentAudio()
                if (url) {
                    audio.src = url
                    audio.load()
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
                    audio.src = url
                    audio.load()
                    audio.currentTime = time
                    if (wasPlaying) {
                        audio.play()
                    }
                } else {
                    audio.currentTime = time
                }
            }
        })
    }
}