import Filter from "./testMeOneMoreTime.js"

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
