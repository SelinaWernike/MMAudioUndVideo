import ChromaKeyFilter from "./filter/ChromaKeyFilter.js"
import BWFilter from "./filter/BWFilter.js"
import InvertFilter from "./filter/InvertFilter.js"
import SepiaFilter from "./filter/SepiaFilter.js"
import RedFilter from "./filter/RedFilter.js"
import GreenFilter from "./filter/GreenFilter.js"
import BlueFilter from "./filter/BlueFilter.js"

export default class FilterManager {

    static fromCopy(copy) {
        return new FilterManager();
    }

    constructor() {
        this.filters = new Map()
        this.filters.set("ChromaKeyFilter", new ChromaKeyFilter())
        this.filters.set("BWFilter", new BWFilter())
        this.filters.set("InvertFilter", new InvertFilter())
        this.filters.set("SerpiaFilter", new SepiaFilter())
        this.filters.set("RedFilter", new RedFilter())
        this.filters.set("GreenFilter", new GreenFilter())
        this.filters.set("BlueFilter", new BlueFilter())
    }

    apply(currentFrame, currentFilter) {
        this.filters.get(currentFilter).apply(currentFrame);
    }

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

