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
        endTime.textContent = this.endTime.toHHMMSS();
    }

    setTrackLength() {
        for (const[key, value] of this.maintrack.durationMap) {
            if(value >= 0) {
               let element = this.maintrack.trackNode.querySelector("#" + key);
               element.style.width = Math.floor(value / this.endTime * 100) + "%"

            }
        }

        for (const[key, value] of this.audiotrack.durationMap) {
            if(value >= 0) {
               let element = this.audiotrack.trackNode.querySelector("#" + key);
               element.style.width = Math.floor(value / this.endTime * 100) + "%"

            }
        }

        for (const[key, value] of this.effecttrack.durationMap) {
            if(value >= 0) {
               let element = this.effecttrack.trackNode.querySelector("#" + key);
               element.style.width = Math.floor(value / this.endTime * 100) + "%"

            }
        }
    }


    getNextVideo() {
        return this.maintrack.next();
    }

    getFirstVideo() {
        let index = this.maintrack.setCurrentElement(0);
        if (index) {
            return this.maintrack.fileKeys[0];
        }
        else {return null;}
    }


    getLastVideo() {
        let index = this.maintrack.setCurrentElement(this.maintrack.fileKeys.length - 1);
        if(index) {
            return this.maintrack.fileKeys[index];
        }
        else {return null;}
    }

    getNextAudio() {
        return this.audiotrack.next();
    }
    // Audio that fits with video.
    getCurrentAudio() {
        const video = document.querySelector("#video")
        let currentTime = getCurrentTime(this.maintrack, video.currentTime);
        let current = this.audiotrack.getElementbyTime(currentTime);
        if (current) {
            this.audiotrack.currentElement = current.element;
            return {url: this.audioTrack.fileKeys[current.element], time: current.time};
        }
        return null;
    }

    getNextFilter() {
        return this.effecttrack.next();
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

 function getCurrentTime(maintrack, delay) {
    let currentIndex = maintrack.currentElement;
    let time = delay;    
    for (let i = 0; i < currentIndex; i++) {
        time += maintrack.durationMap.get(maintrack.element[i].id);
    }
    return time;
}

String.prototype.toHHMMSS = function() {
    let sec_num = parseInt(this, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - minutes * 60;

    if(hours < 10) {hours = "0" + hours;}
    if(minutes < 10) {minutes = "0" + minutes;}
    if(seconds < 10) { seconds = "0" + seconds;}
    return hours + " : " + minutes + " : " + seconds;
}