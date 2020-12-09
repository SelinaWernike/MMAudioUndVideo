import FunctionMap from "./util/functionMap.js"
import settingsManager from "./settingsManager.js";

/**
 * @author Selina Wernike
 * This Class creates a Manager for File Tracks. It enabels the user 
 * to Drag files onto the tracks and change thier sequence in the final
 * Video. It also enables editing the Video, e.g. cutting
 */
export default class EditManager {

    constructor(trackname, loader) {
        this.trackNode = document.querySelector('#' + trackname);
        this.loader = loader;
        this.elements = [];
        this.fileKeys = [];
        this.durationMap = new FunctionMap();
        this.id = 0;
        this.currentElement = -1;
    }

    initializeTrack() {
        this.trackNode.addEventListener("dragover", (ev) => {
            ev.preventDefault();
        })
        this.trackNode.addEventListener('drop', (e) => {
            e.preventDefault();
            let childData = e.dataTransfer.getData('html');
            if (childData) {
                let container = document.createElement('div');
                container.classList.add('column');
                container.id = "item" + this.id;
                container.innerHTML = childData;
                container.children[0].removeAttribute("draggable")
                const fileKey = container.children[0].getAttribute("fileKey")
                let trackObject = this.loader.load(fileKey, container, this);
                if (trackObject !== null) {
                    const dropIndex = this.determineDropIndex(e);
                    this.fileKeys.splice(dropIndex, 0, fileKey);
                    this.elements.push(container);
                    this.durationMap.set(container.id, trackObject.duration);
                    this.resizeElements()
                    this.addDragNDrop(container);
                    if (this.elements.length <= dropIndex + 1) {
                        this.trackNode.appendChild(container)
                    } else {
                        this.trackNode.insertBefore(container, this.elements[dropIndex])
                    }
                    this.addOptionsEvent(container, this.elements.length - 1);
                    this.addRemoveEvent(container, this.elements.length - 1);
                    this.id++;
                    this.trackNode.dispatchEvent(TrackChange);
                }
            }
        });
    }

    determineDropIndex(event) {
        let totalWidth = 0;
        for (let i = 0; i < this.elements.length; i++) {
            if (totalWidth > event.clientX) {
                return i;
            }
            totalWidth += this.elements[i].offsetWidth;
        }
        return this.elements.length;
    }

    addRemoveEvent(item, index) {
        let close = item.querySelector(".close")
        if (!close) {
            close = document.createElement("span");
            close.textContent = "X"
            close.className = "pointer close"
            item.children[0].appendChild(close)
        }
        close.addEventListener("click", () => {
            this.removeElement(item, index)
        })
    }

    addOptionsEvent(item){
        let options = item.querySelector(".options");
        if(!options && this.trackNode.id != "effecttrack") {
            let close = item.querySelector(".close");
            options = document.createElement("div");
            options.className = "pointer options"
            const image = document.createElement('img');
            image.src = '/../images/cut.png';
            image.width = 30;
            image.className = 'fileListImage';
            image.setAttribute("draggable", false);
            options.appendChild(image);
            item.children[0].replaceChild(options, close);
            item.children[0].appendChild(close);
        }

        if(options){
            options.addEventListener("click", () => {
               settingsManager.onSettingsClick(event, this.durationMap)
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
        let width = 100 / this.elements.length;
        this.elements.forEach(element => {
            element.style.width = width + "%";
        });
        this.trackNode.dispatchEvent(TrackChange);
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
                let targetElement = this.trackNode.querySelector("#" + targetObj.id);
                let fileKeyThis = item.children[0].getAttribute("fileKey")
                let fileKeyTarget = targetElement.children[0].getAttribute("fileKey")
                targetElement.innerHTML = item.innerHTML;
                item.innerHTML = targetObj.html;
                this.elements = this.changePosition(this.elements,targetObj, item, compareHTML);
                this.fileKeys = this.changePosition(this.fileKeys, fileKeyThis, fileKeyTarget,compareKeys);
            }
        });
        return item;
    }

    setItemDuration(element, id) {
        this.durationMap.set(id,element.duration)
        console.log(this.durationMap);
        this.trackNode.dispatchEvent(TrackChange);       
    } 

    changePosition(array, item1, item2,comperator) {
        let indexTarget;
        let indexThis;
        for(let i = 0; i < array.length;i++) {
            if(comperator(array[i],item1)) {
                console.log(array + ", index= " + i);
                indexThis = i;
                break;
            }
        }

        for(let i = 0; i < array.length;i++) {
            if(comperator(array[i], item2)) {
                indexTarget = i;
                break;
            }
        }
        let temp = array[indexThis];
        array[indexThis] = array[indexTarget];
        array[indexTarget] = temp;
        this.sectionNode.dispatchEvent(TrackChange);
        return array;
    }


    next() {
        if(this.currentElement < this.elements.length - 1) {
            this.currentElement++;
            return fileKey[this.currentElement]
        }
        return null;
    }

    next(time) {
        let duration = this.durationMap.get("item" + this.currentElement);
        let difference = duration - time;
        if(difference <= 0) {
            this.currentElement++;
            this.next(Math.abs(difference));
        } else {
            return {url: this.fileKeys[this.currentElement], time: Math.abs(difference)};
        }
    }

    setCurrentElement(index) {
        if(this.elements.length >= index) {
            this.currentElement = index;
            return this.currentElement;
        }
        else{ return null;}
    }
}
let TrackChange = new Event("trackChange", {bubbles: true});

function compareHTML(item1, item2) {
    return item1.id == item2.id;
}

function compareKeys(item1, item2) {
    return item1 == item2;
}

