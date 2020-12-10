export default class EffectLoader {

    constructor(filterManager) {
        this.filterManager = filterManager;
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
            return {
                start: function() {
                    return inTrackTime(element.offsetLeft - element.parentNode.offsetLeft)

                },

                duration: function() {
                    return inTrackTime(element.offsetWidth);
                }
            }
        }
        return null;
    }
}

function inTrackTime(value) {
    const endTime = parseFloat(document.querySelector("#endTime").textContent);
    if (endTime === 0) {
        return 0;
    }
    const effectTrack = document.querySelector("#effecttrack");
    return endTime * (value / effectTrack.offsetWidth);
}
