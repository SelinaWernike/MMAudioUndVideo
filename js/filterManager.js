import ChromaKeyFilter from "./filter/ChromaKeyFilter.js"
import BWFilter from "./filter/BWFilter.js"
import InvertFilter from "./filter/InvertFilter.js"
import SepiaFilter from "./filter/SepiaFilter.js"
import ColorFilter from './filter/ColorFilter.js'

export default class FilterManager {

    constructor() {
        this.filters = new Map()
        this.filters.set("BWFilter", new BWFilter())
        this.filters.set("InvertFilter", new InvertFilter())
<<<<<<< HEAD
        this.filters.set("SepiaFilter", new SepiaFilter())
        this.filters.set("RedFilter", new RedFilter())
        this.filters.set("GreenFilter", new GreenFilter())
        this.filters.set("BlueFilter", new BlueFilter())
=======
        this.filters.set("SerpiaFilter", new SepiaFilter())
        this.filters.set("ColorFilter", new ColorFilter())
        this.filters.set("ChromaKeyFilter", new ChromaKeyFilter())
        const filterList = document.getElementById("filterList");
        this.fillHtmlFilterList(filterList);
>>>>>>> remotes/origin/chromaKey
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
        for (const key of this.filters.keys()) {
            const listItem = document.createElement('li');
            listItem.textContent = key;
            listItem.className = "filterListItem"
            listItem.setAttribute("fileKey", key)
            listItem.setAttribute("draggable", true)
            listItem.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("html", e.target.outerHTML);
            });
            filterList.appendChild(listItem);
        }
        return this;
    }
}

