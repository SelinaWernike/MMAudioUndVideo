import FunctionMap from "./util/functionMap.js"
import settingsManager from "./settingsManager.js";
import makeResizable from "./util/resize.js"

/**
 * @author Selina Wernike
 * This Class creates a Manager for File Tracks. It enabels the user 
 * to Drag files onto the tracks and change thier sequence in the final
 * Video. It also enables editing the Video, e.g. cutting
 */
export default class EditManager {

    static fromCopy(copy) {
        const editManager = new EditManager()
        editManager.elements = copy.elements;
        editManager.fileKeys = copy.fileKeys;
        editManager.durationMap = copy.durationMap;
        editManager.startMap = copy.startMap;
        return editManager;
    }

    constructor(trackname, loader, resizable) {
        this.trackNode = document.querySelector('#' + trackname);
        this.loader = loader;
        this.elements = [];
        this.fileKeys = [];
        this.durationMap = new FunctionMap();
        this.startMap = new FunctionMap();
        this.resizable = resizable;
        this.id = 0;
        this.currentElement = -1;
    }

    /**
     * Adds Dragover and Drop Eventlistener to the track. When deopped over the Track
     * the Element will be added to the Track
     */
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
                    this.addElementData(container, fileKey, trackObject, dropIndex);
                    this.addElementEvents(container);
                    this.resizeElements()
                    if (this.elements.length <= dropIndex + 1) {
                        this.trackNode.appendChild(container)
                    } else {
                        this.trackNode.insertBefore(container, this.elements[dropIndex + 1])
                    }
                    this.id++;
                    this.trackNode.dispatchEvent(TrackChange);
                }
            }
        });
    }
/**
 * Saves the data of the added Element into the class attributes filrKeys, Elements and durationMap
 * @param {HTML} container The html-Element whisch is added as a Child of trackNode
 * @param {string} fileKey The fileKey used to load the File
 * @param {HTML} trackObject The video, audio or effect element
 * @param {i} dropIndex the index on which the element is dropped
 */
    addElementData(container, fileKey, trackObject, dropIndex) {
        this.fileKeys.splice(dropIndex, 0, fileKey);
        this.elements.splice(dropIndex, 0, container);
        this.durationMap.set(container.id, { get duration() { return trackObject.duration }, startTime: 0.00});
        if (this.resizable) {
            this.startMap.set(container.id, function () { return trackObject.start });
        } else if (dropIndex > 0) {
            const previousElement = this.elements[dropIndex - 1];
            const previousDuration = this.durationMap.get(previousElement.id);
            this.startMap.set(container.id, previousDuration.duration)
        } else {
            this.startMap.set(container.id, 0);
        }
    }
/**
 * Adds EventListener to the Element on the Track
 * @param {HTML} container 
 */
    addElementEvents(container) {
        this.addDragNDrop(container);
        this.addOptionsEvent(container, this.elements.length - 1);
        this.addRemoveEvent(container, this.elements.length - 1);
        if (this.resizable) {
            this.addResizeEvents(container)
        }
    }

    /**
     * Calculates the index at which the element is inserted based on the drop x-position.
     * 
     * @param {DragEvent} event the event from dropping a element on the track
     */
    determineDropIndex(event) {
        let totalWidth = 0;
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            totalWidth += element.offsetWidth;
            if (totalWidth > event.clientX) {
                if (element.offsetLeft + element.offsetWidth / 2 > event.clientX) {
                    return i;
                } else {
                    return i + 1;
                }
            }

        }
        return this.elements.length;
    }
/**
 * Adds an EventListener for removal
 * @param {*} item 
 * @param {Index} index Index of the Element that should be removed
 */
    addRemoveEvent(item, index) {
        let close = item.querySelector(".close")
        if (!close) {
            close = document.createElement("span");
            close.textContent = "X"
            close.className = "pointer close"
            item.appendChild(close)
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
            options.addEventListener("click", (event) => {
               settingsManager.onSettingsClick(event, this.durationMap)
            })
        }
    }

    /**
     * Removes an element from the track
     */
    removeElement(item, index) {
        item.parentNode.removeChild(item);
        this.elements.splice(index, 1);
        this.fileKeys.splice(index, 1);
        this.durationMap.delete(item.id);
        this.startMap.delete(item.id);
        this.resizeElements();
    }

    /**
     * Resizes an Element according to the number of Elements on the track
     */
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
                e.dataTransfer.setData("trackItem", e.target.id);
            }
        });
        item.addEventListener("drop", (ev) => {
            if (ev.dataTransfer.getData("trackItem")) {
                let targetElement = this.trackNode.querySelector("#" + ev.dataTransfer.getData("trackItem"));
                const childFileKeyIndex = this.resizable ? 1 : 0;
                let fileKeyThis = item.children[childFileKeyIndex].getAttribute("fileKey")
                let fileKeyTarget = targetElement.children[childFileKeyIndex].getAttribute("fileKey")
                item.parentNode.insertBefore(targetElement, item);
                this.elements = this.changePosition(this.elements, targetElement, item, compareHTML);
                this.fileKeys = this.changePosition(this.fileKeys, fileKeyThis, fileKeyTarget, compareKeys);
            }
        });
        return item;
    }

    /**
     * Sets the playtime of an element when first loaded
     * @param {HTML} element  
     * @param {int} id 
     */
    setItemDuration(element, id) {
        // this.durationMap.set(id,element.duration)
        this.durationMap.set(id,{duration: element.duration, startTime: 0.00})
        console.log(this.durationMap);
        this.trackNode.dispatchEvent(TrackChange);
    } 

    /**
     * Changes the position of two elements on the track
     * @param {*} array The array in which the elements lay
     * @param {*} item1 
     * @param {*} item2 
     * @param {function} comperator How the two elements need to be compared
     * @see  compareHTML(item1, item2), compareKeys(item1, item2) 
     */
    changePosition(array, item1, item2,comperator) {
        let indexTarget;
        let indexThis;
        for(let i = 0; i < array.length;i++) {
            if(comperator(array[i],item1)) {
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
        this.trackNode.dispatchEvent(TrackChange);
        return array;
    }

    addResizeEvents(element) {
        const leftResize = document.createElement("span")
        leftResize.className = "resize resize-left"
        element.insertBefore(leftResize, element.children[0])
        const spacer = document.createElement("div");
        spacer.style.flexGrow = 1;
        element.insertBefore(spacer, element.children[2])
        const rightResize = document.createElement("span")
        rightResize.className = "resize resize-right"
        element.appendChild(rightResize)
        makeResizable(element, leftResize, rightResize, 10)
    }

    /**
     * Changes StartTime or Duration of an Element
     * @param {string} key 
     * @param {*} timeObject Object containing startTime and duartion
     */
    changeTime(key, timeObject) {
        this.durationMap.set(key,timeObject);
        this.trackNode.dispatchEvent(TrackChange);
    }

    /**
     * Returns next Element in the Track if possible
     * @returns {object} object containing fileKey, startTime and duration
     */
    next() {
        if (this.currentElement < this.elements.length - 1) {
            this.currentElement++;
            return {fileKey : this.fileKeys[this.currentElement], startTime : this.durationMap.get(this.elements[this.currentElement].id).startTime,
                                duration : this.durationMap.get(this.elements[this.currentElement].id).duration }
        }
        return null;
    }
/**
     * Returns previous Element in the Track if possible
     * @returns {object} object containing fileKey, startTime and duration
     */
    previous() {
        if (this.currentElement > 0) {
            this.currentElement--;
            return {fileKey : this.fileKeys[this.currentElement], startTime : this.durationMap.get(this.elements[this.currentElement].id).startTime,
                        duration : this.durationMap.get(this.elements[this.currentElement].id).duration }
        }
        return null;
    }

    /**
     * Returns Element according to Index in the Track if possible
     * @param {int} Index of the Element
     * @returns {object} object containing fileKey, startTime and duration
     */
    getElementByIndex(index) {
        if (this.elements.length > index && index >= 0) {
            this.currentElement = index;
            return {fileKey : this.fileKeys[this.currentElement], startTime : this.durationMap.get(this.elements[this.currentElement].id).startTime,
            duration : this.durationMap.get(this.elements[this.currentElement].id).duration }
        }
        return null;
    }
/**
     * Returns Element according to given time in the Track if possible
     * @param {int} Time in seconds
     * @returns {object} object containing fileKey, startTime and duration
     */
    getElementByTime(time) {
        for (let i = 0; i < this.elements.length; i++) {
            const startTime = this.startMap.get(this.elements[i].id);
            const endTime = startTime + this.durationMap.get(this.elements[i].id).duration;
            if (time >= startTime && time <= endTime) {
                this.currentElement = i;
                console.log(this.durationMap);
                return {
                    fileKey: this.fileKeys[i], 
                    startTime: this.durationMap.get("item" + i).startTime,
                    duration: this.durationMap.get("item" + i).duration,
                    time: time - startTime + this.durationMap.get(this.elements[this.currentElement].id).startTime,
                }
            }
        }
        return null;
    }
}
let TrackChange = new Event("trackChange", {bubbles: true});
// Two Comperators
function compareHTML(item1, item2) {
    return item1.id == item2.id;
}

function compareKeys(item1, item2) {
    return item1 == item2;
}

