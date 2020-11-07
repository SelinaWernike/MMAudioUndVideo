export default class EditManager {

    constructor(trackname, sectionname, type) {
        this.type = type;
        this.trackNode = document.querySelector('#' + trackname);
        this.sectionNode = document.querySelector('#' + sectionname);
        this.elements = [];
        this.fileNames = [];
    }

    initializeTrack() {
        this.sectionNode.addEventListener("dragover", (ev) => {
            ev.preventDefault();
        })
        this.sectionNode.addEventListener('drop', (e) => {
            e.preventDefault();
            let childData = e.dataTransfer.getData('html');
            if (childData) {
                let container = document.createElement('div');
                container.classList.add('column');
                container.innerHTML = childData;
                this.elements.push(container)
                let nameElement = container.querySelector(".fileNameText");
                let name = nameElement.innerHTML;
                this.fileNames.push(name);
                // TODO: type (audio or video) should be checked against file.type
                if(name.includes(this.type)) {
                    var width = 100 / (this.elements.length + 1);
                    if(this.elements.length > 0 && width > 1) {
                        container.style.width = width + "%";
                        this.elements.forEach(col => {
                            console.log(width);
                            col.style.width = width + "%";
                        });
                    }
                    this.trackNode.appendChild(container);
                    this.addRemoveEvent();
                    this.addDragNDrop()
                }
            }
        });
    }

    addRemoveEvent() {
        this.elements.forEach((item, index) => {
            let close = item.querySelector("span");
            close.addEventListener("click", () => {
                this.removeElement(item, index)
            })
        });
    }

    removeElement(item, index) {
        item.parentNode.removeChild(item);
        this.elements.splice(index, 1)
        this.fileNames.splice(index, 1)
    }

    addDragNDrop() {
        this.elements.forEach(item => {
            item.setAttribute("draggable", true);
           /* item.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("trackItem", e.target.outerHTML);
            }); */

        });
    }

}
