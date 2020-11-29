export default class EffectLoader {
    constructor(filterManager) {
        this.filterManager = filterManager
    }
    load(fileKey) {
        return fileKey;
    }

    getDuration(filter) {
        return filter.duration;
    }
}