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

    /**
     * Sets the End Time of the Time Bar. By calling the VideoTrack.
     */
    setEndTime(userInterface = true) {
        let time = 0;
        for (const [key, value] of this.maintrack.durationMap) {
            if (value.duration >= 0) {
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
/**
 * Returns the next video on the maintrack, if possible
 * @returns {object} object containing fileKey, startTime and duration
 */
    getNextVideo() {
        let nextObject = this.maintrack.next();
        if(nextObject != null) {
            if(this.maintrack.currentElement > 0) {
            dehighlightContainer(this.maintrack.currentElement - 1, this.maintrack);
            }
            highlightContainer(this.maintrack.currentElement, this.maintrack)
        }
        return nextObject;
    }
/**
 * Returns the previous video on the maintrack, if possible
 * @returns {object} object containing fileKey, startTime and duration
 */
    getPreviousVideo() {
        let previousObject = this.maintrack.previous();
        if(previousObject != null) {
            dehighlightContainer(this.maintrack.currentElement + 1, this.maintrack);
            highlightContainer(this.maintrack.currentElement, this.maintrack)
        }
        return previousObject;
    }
/**
 * Returns the first video on the maintrack, if possible
 * @returns {object} object containing fileKey, startTime and duration
 */
    getFirstVideo() {
        let index = this.maintrack.currentElement;
        let firstObject = this.maintrack.getElementByIndex(0);
        if(firstObject != null) {
            if(index > 0) {
            dehighlightContainer(index, this.maintrack);
            }
            highlightContainer(this.maintrack.currentElement, this.maintrack);
        }
        return firstObject;
    }
/**
 * Returns the last video on the maintrack, if possible
 * @returns {object} object containing fileKey, startTime and duration
 */
    getLastVideo() {
        let index = this.maintrack.currentElement;
        let lastObject = this.maintrack.getElementByIndex(this.maintrack.fileKeys.length - 1);
        if(lastObject != null) {
            if(index > 0) {
            dehighlightContainer(index, this.maintrack);
            }
            highlightContainer(this.maintrack.currentElement, this.maintrack);
        }
        return lastObject;
    }
/**
 * Returns the next Audio on the Audiotrack, if possible
 * @returns {object} object containing fileKey, startTime and duration
 */
    getNextAudio() {
        let nextObject = this.audiotrack.next();
        if(nextObject != null) {
            if(this.audiotrack.currentElement > 0) {
                dehighlightContainer(this.audiotrack.currentElement - 1, this.audiotrack);
            }
            highlightContainer(this.audiotrack.currentElement, this.audiotrack)
        }
        return nextObject;
    }

/**
 * Returns the Audio that corresponds with the current Videoelement on the Audiotrack, if possible
 * @returns {object} object containing fileKey, startTime and duration
 */    
    getCurrentAudio(video = document.querySelector("#video")) {
        let currentTime = this.getCurrentTime(video);
        let index = this.audiotrack.currentElement;
        let currentObject = this.audiotrack.getElementByTime(currentTime);
        if(currentObject != null) {
            if(index > 0) {
            dehighlightContainer(index, this.audiotrack);
            }
            highlightContainer(this.audiotrack.currentElement, this.audiotrack);
        }
        return currentObject;
    }
/**
 * Returns the Effec that corresponds with the current Videoelement on the Effecttrack, if possible
 * @returns {object} object containing fileKey, startTime and duration
 */ 
    getCurrentFilter(video = document.querySelector("#video")) {
        let index = this.effecttrack.currentElement;
        let currentTime = this.getCurrentTime(video);
        let current = this.effecttrack.getElementByTime(currentTime);
        if (current || current != null) {
            if(index > 0) {
            dehighlightContainer(index, this.effecttrack);
            }
            highlightContainer(this.effecttrack.currentElement, this.effecttrack);
            return current.fileKey;
        }
        return null;
    }

    getCurrentTime(video) {
        let currentIndex = this.maintrack.currentElement;
        let time = video.currentTime - video.startTime;
        for (let i = 0; i < currentIndex; i++) {
            time += this.maintrack.durationMap.get(this.maintrack.elements[i].id).duration;
        }
        return time;
    }

    jumpToTime(time, track, key){
        //unterscheidung zwischen Videotrack und Audiotrack?
        // wenn ja, müsste es noch eine "getElementByKey" Methode oder so geben,
        // um gleiches Format zu haben wie bei getElementByTime/getElementByIndex

        console.log("jumpToTime");
        let globalTime = 0;
        //evtl könnte man hier die editManager-startmap nutzen?
        for (let i = 0; i < track.elements.length; i++) {
            if (track.elements[i].id === key) {
                break;
            }
            globalTime += track.durationMap.get(track.elements[i].id).duration;
        }
        console.log(globalTime);
        let videoElement = this.maintrack.getElementByTime(globalTime + parseFloat(time));
        console.log(videoElement);
        //help ich kenn an dieser Stelle videoController noch nicht
        this.videoController.changeVideoSource(videoElement);
        this.videoController.setCurrentTime(time);
        console.log("done! .. i hope.");
    }
    
}

function highlightContainer(index, track) {
    let element = track.elements[index];
    element.style.backgroundColor = "yellow";
}

function dehighlightContainer(index, track) {
    let element = track.elements[index];
    element.style.backgroundColor = "white";
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
