import ChromaKeyFilter from "./filter/ChromaKeyFilter.js"
import BWFilter from "./filter/BWFilter.js"
import InvertFilter from "./filter/InvertFilter.js"
import SepiaFilter from "./filter/SepiaFilter.js"
import ColorFilter from './filter/ColorFilter.js'

export default class FilterManager {

    constructor() {
        this.filters = new Map()
        this.filters.set("Graufilter", new BWFilter())
        this.filters.set("Negativfilter", new InvertFilter())
        this.filters.set("Sepiafilter", new SepiaFilter())
        this.filters.set("Farbfilter", new ColorFilter())
        this.filters.set("ChromaKeying", new ChromaKeyFilter());
    }

    /**
     * Applies current image filter to current video frame.
     * @param currentFrame
     * @param currentFilter
     */
    apply(currentFrame, currentFilter) {
        this.filters.get(currentFilter).apply(currentFrame);
    }

    /**
     * Displays available filters.
     * @returns {FilterManager}
     */
    fillHtmlFilterList() {
        const filterList = document.getElementById("filterList");
        for (const [key, value] of this.filters.entries()) {
            const listItem = document.createElement('li');
            listItem.textContent = key;
            listItem.className = "filterListItem"
            listItem.setAttribute("fileKey", key)
            listItem.setAttribute("draggable", true)
            listItem.addEventListener("dragstart", (e) => {
                if (e.target.children.length > 0) {
                    const copy = e.target.cloneNode(true)
                    for (const child of copy.children) {
                        copy.removeChild(child)
                    }
                    e.dataTransfer.setData("html", copy.outerHTML)
                } else {
                    e.dataTransfer.setData("html", e.target.outerHTML)
                }
            });
            if (value.getAdditionalInputs) {
                for (const input of value.getAdditionalInputs()) {
                    listItem.appendChild(input)
                }
            }
            filterList.appendChild(listItem);
        }
        return this;
    }
}
