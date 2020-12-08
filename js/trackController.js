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
    setEndTime() {
        let time = 0;
        for (const[key, value] of this.maintrack.durationMap) {
            if(value >= 0) {
                time = time + value;

            }
        }
        this.endTime = time;
        let endTime = document.querySelector("#endTime");
        endTime.textContent = this.endTime;
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
        let index = this.maintrack.setCurrentElement(0);
        return this.maintrack.fileKeys[index];
    }

    getLastVideo() {
        let index = this.maintrack.setCurrentElement(this.maintrack.fileKeys.length - 1);
        return this.maintrack.fileKeys[index];
    }

    getNextAudio() {
        return this.audiotrack.next();
    }

    getCurrentAudio() {
        const video = document.querySelector("#video")
        let currentTime = getCurrentTime(this.maintrack, video.currentTime);
        let current = this.audiotrack.getElementbyTime(currentTime);
        if (current) {
            this.audiotrack.currentElement = current.element;
            return {url: this.audioTrack.fileKeys[current.element], time: current.time};
        }
        return {url: null, time: null};
    }

    getCurrentFilter() {
        const video = document.querySelector("#video")
        let currentTime = getCurrentTime(this.maintrack, video.currentTime);
        let current = this.effecttrack.getElementbyTime(currentTime);
        if (current) {
            this.effecttrack.currentElement = current.element;
            return this.effecttrack.fileKeys[current.element];
        }
        return null;
    }
}

function setTrackLength(track, endTime) {
    for (const[key, value] of track.durationMap) {
        if(value >= 0) {
           let element = track.trackNode.querySelector("#" + key);
           element.style.width = Math.floor(value / endTime * 100) + "%"
        }
    }
}

function getCurrentTime(maintrack, delay) {
    let currentIndex = maintrack.currentElement;
    let time = delay;
    for (let i = 0; i < currentIndex; i++) {
        time += maintrack.durationMap.get(maintrack.elements[i].id);
    }
    return time;
}