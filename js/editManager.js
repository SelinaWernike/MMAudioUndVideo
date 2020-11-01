export default class EditManager {

    constructor(trackname, sectionname, type) {
        this.type = type;
        this.trackNode = document.querySelector('#' + trackname);
        this.sectionNode = document.querySelector('#' + sectionname);
        this.elements = [];
    }

    initializeTrack() {
        this.sectionNode.addEventListener("dragover", (ev) => {
            ev.preventDefault();
        })
        this.sectionNode.addEventListener('drop', (e) => {
            e.preventDefault();
            let childData = e.dataTransfer.getData('html');
            if(childData) {

                let container = document.createElement('div');
                container.classList.add('column');
                container.innerHTML = childData;
                let nameElement = container.querySelector(".fileNameText");
                let name = nameElement.innerHTML;
                console.log(name);
                console.log(childData);
                if(name.includes(this.type)) {
                    this.elements = this.sectionNode.querySelectorAll(".column");
                    var width = 100 / (this.elements.length + 1);
                    if(this.elements.length > 0 && width > 1) {
                        container.style.width = width + "%";
                        this.elements.forEach(col => {
                            console.log(width);
                            col.style.width = width + "%";
                        });
                    }
                    this.trackNode.appendChild(container);
                    this.elements = this.sectionNode.querySelectorAll(".column");
                    this.removeElement();
                    this.addDragNDrop()
                    
                }
            }
        });
    }

    removeElement() {
        this.elements.forEach(item => {
            let close = item.querySelector("span");
            close.onclick = function() {
                item.parentNode.removeChild(item);
            };
        });
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
