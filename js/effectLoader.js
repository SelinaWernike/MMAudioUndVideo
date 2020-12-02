export default class EffectLoader {

    constructor(filterManager) {
        this.filterManager = filterManager;
    }

    /**
     * Checks if the fileKey belongs to a filter and if true, returns an object that determines
     * itś duration based on the percentage of own width to the total track time.
     * 
     * @param {String} fileKey the fileKey of the filter
     * @param {HTMLElement} element the element on the track
     */
    load(fileKey, element) {
        if (this.filterManager.filters.has(fileKey)) {
            return {
                duration: function() {
                    const endTime = parseFloat(document.querySelector("#endTime").textContent)
                    if (endTime === 0) {
                        return 0
                    }
                    return endTime / element.offsetWidth
                } 
            }
        } else {
            return null;
        }
    }
}
