import FunctionMap from "./util/functionMap.js"

/**
 * @author Selina Wernike
 * This Class creates a Manager for File Tracks. It enabels the user 
 * to Drag files onto the tracks and change thier sequence in the final
 * Video. It also enables editing the Video, e.g. cutting
 */
export default class EditManager {

    constructor(trackname, sectionname, loader) {
        this.trackNode = document.querySelector('#' + trackname);
        this.sectionNode = document.querySelector('#' + sectionname);
        this.loader = loader;
        this.elements = [];
        this.fileKeys = [];
        this.durationMap = new FunctionMap();
        this.id = 0;
        this.currentElement = null;
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
                container.id = "item" + this.id;
                container.innerHTML = childData;
                container.children[0].removeAttribute("draggable")
                const fileKey = container.children[0].getAttribute("fileKey")
                let trackObject = this.loader.load(fileKey, container);
                if (trackObject !== null) {
                    this.fileKeys.push(fileKey)
                    this.elements.push(container)
                    this.durationMap.set(container.id, trackObject.duration);
                    this.resizeElements()
                    this.addDragNDrop(container);
                    this.trackNode.appendChild(container);
                    const childElement = this.trackNode.querySelector("#item" + this.id);
                    this.addRemoveEvent(childElement, this.elements.length - 1);
                    this.id++;
                }
            }
        });
    }

    addRemoveEvent(item, index) {
        let close = item.querySelector("span")
        if (close) {
            close.addEventListener("click", () => {
                this.removeElement(item, index)
            })
        }
    }

    /**
     * removes an element from the track
     */
    removeElement(item, index) {
        item.parentNode.removeChild(item);
        this.elements.splice(index, 1);
        this.fileKeys.splice(index, 1);
        this.durationMap.delete(item.id);
        this.resizeElements();
    }

    resizeElements() {
        let width = 99 / this.elements.length;
        this.elements.forEach(element => {
            element.style.width = width + "%";
        });
    }

    /**
     * Adds Drag and Drop to the Track elements
     * @param {Node} item Sets the Drag and Drop event for the Track Elements. This enabels
     * the Position change on the Track. 
     */
    addDragNDrop(item) {
        item.setAttribute("draggable", true);
        item.addEventListener("dragstart", (e) => {
            if (e.target.id) {
                let obj = {
                    id: e.target.id,
                    html: e.target.innerHTML
                };
                e.dataTransfer.setData("trackItem", JSON.stringify(obj));

            }
        });
        item.addEventListener("drop", (ev) => {
            if (ev.dataTransfer.getData("trackItem")) {
                let targetObj = JSON.parse(ev.dataTransfer.getData("trackItem"));
                let targetElement = this.sectionNode.querySelector("#" + targetObj.id);
                let fileKeyThis = item.children[0].getAttribute("fileKey")
                let fileKeyTarget = targetElement.children[0].getAttribute("fileKey")
                targetElement.innerHTML = item.innerHTML;
                item.innerHTML = targetObj.html;
                this.elements = this.sectionNode.querySelectorAll(".column");
                let indexTarget;
                let indexThis;
                console.log(this.fileKeys);
                for(let i = 0; i < this.fileKeys.length;i++) {
                    if(this.fileKeys[i] === fileKeyThis) {
                        indexThis = i;
                        break;
                    }
                }

                for(let i = 0; i < this.fileKeys.length;i++) {
                    if(this.fileKeys[i] === fileKeyTarget) {
                        indexTarget = i;
                        break;
                    }
                }
                let temp = this.fileKeys[indexThis];
                this.fileKeys[indexThis] = this.fileKeys[indexTarget];
                this.fileKeys[indexTarget] = temp;
                console.log(this.fileKeys);

            }
        });
    }
}

