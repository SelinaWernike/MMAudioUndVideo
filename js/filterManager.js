export default class FilterManager {

    constructor() {
        this.filters = []
        const filterList = document.getElementById("filterList");
        this.fillHtmlFilterList(filterList);
    }

    apply(currentFrame) {
        let current = currentFrame
        for (let filter in this.filters) {
            current = filter.apply(current)
        }
        return current
    }

    fillHtmlFilterList(ul){
        const filterArray = ["Rotfilter", "Blaufilter", "Grünfilter", "Sepiafilter", "Chroma-Keying"];

        for (const filterName of filterArray) {
            const listItem = document.createElement('li');

            let text = document.createTextNode(filterName);
            listItem.appendChild(text);

            listItem.setAttribute("draggable", true);
            listItem.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("html", e.target.innerHTML)
            })

            ul.appendChild(listItem);
        }

    }
}

