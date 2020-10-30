window.onload = function() {
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
    setLoopIcon()

    video.addEventListener("ended", () => {
        pauseIcon.setAttribute("hidden", "")
        playIcon.removeAttribute("hidden")
    })

    window.onPlayClick = function() {
        video.play()
        pauseIcon.removeAttribute("hidden")
        playIcon.setAttribute("hidden", "")
    }

    window.onPauseClick = function() {
        video.pause()
        pauseIcon.setAttribute("hidden", "")
        playIcon.removeAttribute("hidden")
    }

    window.onToStartClick = function() {
        video.currentTime = 0
    }

    window.onToEndClick = function() {
        video.currentTime = video.duration
    }

    window.onRewindClick = function() {
        video.currentTime -= 5
    }

    window.onForwardClick = function() {
        video.currentTime += 5
    }

    window.onLoopClick = function() {
        video.loop = !video.loop
        setLoopIcon()
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

    function changeVolume(volume) {
        if (volume == 0) {
            volumeOffIcon.removeAttribute("hidden")
            volumeOnIcon.setAttribute("hidden", "")
        } else {
            volumeOffIcon.setAttribute("hidden", "")
            volumeOnIcon.removeAttribute("hidden")
        }
        video.volume = volume
    }

    function setLoopIcon() {
        console.log(video.loop)
        if (video.loop) {
            noLoopIcon.setAttribute("hidden", "")
            loopIcon.removeAttribute("hidden")
        } else {
            noLoopIcon.removeAttribute("hidden")
            loopIcon.setAttribute("hidden", "")
        }
    }
}
