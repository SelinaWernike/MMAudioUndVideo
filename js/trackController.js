/**
 * @author Selina Wernike
 * This class connects the elements of the track area with the rest of the application. 
 * Might use Publisher Subscriber Model for Kommunikation between TrackManager and Controller 
 */
export default class TrackController {

    constructor(maintrack, audiotrack, effecttrack) {
        this.maintrack = maintrack;
        this.audiotrack = audiotrack;
        this.effecttrack = effecttrack;
        this.endTime = 0.0;
        this.currentTime = 0.0;
    }

    setAudioController(audioController) {
        this.audioController = audioController;
    }

    setVideoController(videoController) {
        this.videoController = videoController;
    }

    setAudioController(effectController) {
        this.effectController = effectController;
    }

    /**
     * Sets the Time of the Time Bar. By calling the Videomanager.
     */
    setEndTime(userInterface = true) {
        let time = 0;
        for (const [key, value] of this.maintrack.durationMap) {
            // if(value >= 0) {
            if (value.duration >= 0) {
                // time = time + value;
                time = time + value.duration;
            }
        }
        this.endTime = time;
        if (userInterface) {
            let endTime = document.querySelector("#endTime");
            endTime.textContent = toHHMMSS(this.endTime);
        }
    }

    setTrackLength() {
        setTrackLength(this.maintrack, this.endTime)
        setTrackLength(this.audiotrack, this.endTime)
        setTrackLength(this.effecttrack, this.endTime)
    }

    getNextVideo() {
        return this.maintrack.next();
    }

    getPreviousVideo() {
        return this.maintrack.previous();
    }

    getFirstVideo() {
        return this.maintrack.getElementByIndex(0);
    }

    getLastVideo() {
        return this.maintrack.getElementByIndex(this.maintrack.fileKeys.length - 1);
    }

    getNextAudio() {
        return this.audiotrack.next();
    }

    getCurrentAudio(video = document.querySelector("#video")) {
        let currentTime = this.getCurrentTime(video);
        let current = this.audiotrack.getElementByTime(currentTime);
        if (current) {
            return current;
        }
        return { fileKey: null, time: null };
    }

    getCurrentFilter(video = document.querySelector("#video")) {
        let currentTime = this.getCurrentTime(video);
        let current = this.effecttrack.getElementByTime(currentTime);
        if (current) {
            return current.fileKey;
        }
        return null;
    }

    getCurrentTime(video) {
        let currentIndex = this.maintrack.currentElement;
        let time = video.currentTime;
        for (let i = 0; i < currentIndex; i++) {
            time += this.maintrack.durationMap.get(this.maintrack.elements[i].id).duration;
        }
        return time;
    }
}

function setTrackLength(track, endTime) {
    for (const [key, value] of track.durationMap) {
        // if(value >= 0) {
        if (value.duration >= 0) {
            let element = track.trackNode.querySelector("#" + key);
            // element.style.width = Math.floor(value / endTime * 100) + "%"
            element.style.width = Math.floor(value.duration / endTime * 100) + "%"
        }
    }
}

function toHHMMSS(totalSeconds) {
    let sec_num = totalSeconds;
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = Math.floor(sec_num - (hours * 3600) - minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + " : " + minutes + " : " + seconds;
}
