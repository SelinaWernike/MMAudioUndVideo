export default class AudioController {

    constructor(fileManager, trackController) {
        const audio = document.querySelector("#audio")
        const video = document.querySelector("#video")

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
