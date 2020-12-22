export default class EffectLoader {

    constructor(filterManager) {
        this.filterManager = filterManager;
    }

    setTrackManager(trackManager) {
        this.trackManager = trackManager;
    }

    /**
     * Checks if the fileKey belongs to a filter and if true, returns an object that determines
     * itś duration and start time based on the percentage of own width and left position to the total track time.
     * 
     * @param {String} fileKey the fileKey of the filter
     * @param {HTMLElement} element the element on the track
     */
    load(fileKey, element) {
        if (this.filterManager.filters.has(fileKey)) {
            return new Filter(this.trackManager, element);
        }
        return null;
    }
}

class Filter {

    constructor(trackManager, element) {
        this.trackManager = trackManager;
        this.element = element;
    }

    get start() {
        return this.inTrackTime(this.element.offsetLeft - this.element.parentNode.offsetLeft)
    }

    get duration() {
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
