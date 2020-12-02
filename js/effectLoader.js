export default class EffectLoader {
    constructor(filterManager) {
        this.filterManager = filterManager
    }
    load(fileKey) {
        return fileKey;
    }

    getDuration(filter) {
        console.log(parseInt(filter.duration));
        return filter.duration;
    }
}