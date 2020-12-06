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

    /**
     * Sets the Time of the Time Bar. By calling the Videomanager.
     */
    setEndTime() {
        let time = 0;
        for (const[key, value] of this.maintrack.durationMap) {
            if(value >= 0) {
                console.log(this.maintrack.durationMap);
                time = time + value;

            }
        }
        this.endTime = time;
        let endTime = document.querySelector("#endTime");
        endTime.innerHTML = this.endTime;
    }

    setTrackLength() {
        for (const[key, value] of this.maintrack.durationMap) {
            if(value >= 0) {
               let element = this.maintrack.sectionNode.querySelector("#" + key);
               element.style.width = Math.floor(value / this.endTime * 99) + "%"

            }
        }

        for (const[key, value] of this.audiotrack.durationMap) {
            if(value >= 0) {
               let element = this.audiotrack.sectionNode.querySelector("#" + key);
               element.style.width = Math.floor(value / this.endTime * 99) + "%"

            }
        }

        for (const[key, value] of this.effecttrack.durationMap) {
            if(value >= 0) {
               let element = this.effecttrack.sectionNode.querySelector("#" + key);
               element.style.width = Math.floor(value / this.endTime * 99) + "%"

            }
        }
    }


    getNextVideo() {
        return this.maintrack.next();
    }

    getFirstVideo() {
        let index = this.maintrack.setCurrentElement(0);
        if (index) {
            this.audiotrack.setCurrentElement(0);
            this.effecttrack.setCurrentElement(0);
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

    getCurrentAudio() {
        return { url: this.audiotrack.fileKeys[this.audiotrack.currentElement], time: 0 }
    }

    getNextFilter() {
        return this.effecttrack.next();
    }
    getCurrentFilter() {
        return this.effecttrack.fileKeys[this.effecttrack.currentElement];
    }
}