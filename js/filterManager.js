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
        this.filters.set("Serpiafilter", new SepiaFilter())
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
        for (const key of this.filters.keys()) {
            const listItem = document.createElement('li');
            if (key == "Farbfilter") {
                var colorFilterColor = document.createElement("input");
                colorFilterColor.setAttribute("id", "colorFilterColor");
                colorFilterColor.setAttribute("type", "color");
                colorFilterColor.setAttribute("value", "#FF00FF");
            }
            
            if (key == "ChromaKeying") {
                var ckFilterColor = document.createElement("input");
                ckFilterColor.setAttribute("id", "ckFilterColor");
                ckFilterColor.setAttribute("type", "color");
                ckFilterColor.setAttribute("value", "#00FF00");
            }

            listItem.textContent = key;
            if (key == "ChromaKeying") {
                var imageInput = document.createElement("input");
                imageInput.setAttribute("id", "imageInput");
                imageInput.setAttribute("type", "file");
                imageInput.setAttribute("hidden", "");
                imageInput.setAttribute("accept", "image/");
                var imageInLabel = document.createElement("label");
                imageInLabel.setAttribute("for","imageInput");
                imageInLabel.setAttribute("id","imageLabel");
                imageInLabel.innerHTML="+BGImage";
            }

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

