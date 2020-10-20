export default class FilterManager {

    constructor() {
        this.filters = []
    }

    apply(currentFrame) {
        let current = currentFrame
        for (let filter in this.filters) {
            current = filter.apply(current)
        }
        return current
    }
}
