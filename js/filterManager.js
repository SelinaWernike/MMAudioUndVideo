export default class FilterManager {

    constructor() {
        this.filters = []
    }

    apply(currentFrame) {
        let current = currentFrame
        for (let filter of this.filters) {
            filter.apply(current)
        }
    }

    static fillHtmlFilterList(ul){
        const filterArray = ["Rotfilter", "Blaufilter", "Grünfilter", "Sepiafilter", "Chroma-Keying"];

        for (const filterName of filterArray) {
            const listItem = document.createElement('li');
            const button = document.createElement('button');

            let text = document.createTextNode(filterName);
            button.style.margin = "2% auto";
            button.style.display = "block";
            button.appendChild(text);
            button.addEventListener("click", () => {
                appendItemToFilterList(button);
            });
            listItem.appendChild(button);

            ul.appendChild(listItem);
        }

    }
}

function appendItemToFilterList(button) {
    const filterList = document.getElementById("filterList");
    const listItem = document.createElement('li');
    const textDiv = document.createElement("div");
    const text = document.createTextNode(button.textContent);
    const spanDiv = document.createElement("div");
    const span = document.createElement("SPAN");
    const spanText = document.createTextNode("X");
    textDiv.appendChild(text);
    listItem.appendChild(textDiv);
    // span.className = "close";
    span.appendChild(spanText);
    span.onclick = function() {
        document.getElementById("filterList").removeChild(listItem);
    };
    spanDiv.appendChild(span);
    listItem.appendChild(spanDiv);
    filterList.appendChild(listItem);

    let filterModal = document.querySelector("#filterModal");
    filterModal.style.display = "none";
}