export default class Filter {

    constructor(trackManager, element) {
        this.trackManager = trackManager;
        this.element = element;
    }

    start() {
        return this.inTrackTime(this.element.offsetLeft - this.element.parentNode.offsetLeft)
    }

    duration() {
        return this.inTrackTime(this.element.offsetWidth);
    }

    inTrackTime(value) {
        const endTime = this.trackManager.endTime;
        if (endTime === 0) {
            return 0;
        }
        const effectTrack = document.querySelector("#effecttrack");
        return endTime * (value / effectTrack.offsetWidth);
    }
}