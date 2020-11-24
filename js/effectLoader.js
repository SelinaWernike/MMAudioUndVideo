export default class EffectLoader {

    constructor(filterManager) {
        this.filterManager = filterManager;
    }

    load(fileKey) {
        if (this.filterManager.filters.has(fileKey)) {
            return { duration: 0 }
        } else {
            return null;
        }
    }
}
