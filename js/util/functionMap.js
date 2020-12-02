export default class FunctionMap extends Map {

    get(key) {
        const value = super.get(key)
        if (value instanceof Function) {
            return value()
        } else {
            return value;
        }
    }
}