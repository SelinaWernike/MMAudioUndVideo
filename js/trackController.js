/**
 * @author Selina Wernike
 * This class connects the elements of the track area with the rest of the application. 
 * Might use Publisher Subscriber Model for Kommunikation between TrackManager and Controller 
 */
export default class TrackController {


    constructor(maintrack, tracklist) {
        this.maintrack = maintrack;
        this.tracklist = tracklist;
        this.endTime = 0;
        this.currentTime = 0; 
    }

    /**
     * Sets the Time of the Time Bar. By calling the Videomanager.
     */
    setEndTime() {
        for (const[key, value] of this.maintrack.durationMap.entries()) {
            this.endTime = this.endTime + value;
        }
        let endTime = document.querySelector("#endTime");
        endTime.innerHTML = this.endTime;
    }

    /**
     * Sets the current Elements in the Track lists and returns the intersting Informations(effect and file) to the VideoManager
     * @param {int} time The time in sconds from the videoManager. 
     * @returns {obj} information Important Information for Video Controller
     */
    syncVideoController(time) {
        return null;
    }
}