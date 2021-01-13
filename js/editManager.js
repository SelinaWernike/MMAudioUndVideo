import FunctionMap from "./util/functionMap.js"
import SettingsManager from "./settingsManager.js";
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
    initializeTrack(controller) {
        this.controller = controller;
        this.trackNode.addEventListener("dragover", (ev) => {
            ev.preventDefault();
        })
        this.trackNode.addEventListener('drop', (e) => {
            e.preventDefault();
            let childData = e.dataTransfer.getData('html');
            if (childData) {
                let container = document.createElement('div');
                container.classList.add('column');
                container.id = "item" + this.id++;
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
        this.durationMap.set(container.id, { get duration() { return trackObject.duration }, startTime: 0.00, origDuration: trackObject.duration});
        if (this.resizable) {
            this.startMap.set(container.id, function () { return trackObject.start });
        } else {
            this.startMap.set(container.id, this.getGlobalStartTime.bind(this, container.id));
        }
    }

    getGlobalStartTime(elementId) {
        let globalTime = 0;
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id === elementId) {
                return globalTime;
            }
            globalTime += this.durationMap.get(this.elements[i].id).duration;
        }
        return globalTime;
    }


/**
 * Adds EventListener to the Element on the Track
 * @param {HTML} container 
 */
    addElementEvents(container) {
        this.addDragNDrop(container);
        this.addOptionsEvent(container);
        this.addRemoveEvent(container);
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
    addRemoveEvent(item) {
        let close = item.querySelector(".close")
        if (!close) {
            close = document.createElement("span");
            close.textContent = "X"
            close.className = "pointer close"
            item.appendChild(close)
        }
        close.addEventListener("click", () => {
            this.removeElement(item)
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
               SettingsManager.onSettingsClick(event, this.durationMap)
            })
        }
    }

    /**
     * Removes an element from the track
     */
    removeElement(item) {
        item.parentNode.removeChild(item);
        const index = this.elements.findIndex(element => element.id === item.id);
        this.elements.splice(index, 1);
        this.fileKeys.splice(index, 1);
        this.durationMap.delete(item.id);
        this.startMap.delete(item.id);
        this.resizeElements();
        if(SettingsManager.isSettingsOpen()){
            SettingsManager.closeSettings();
        }
        this.trackNode.dispatchEvent(TrackChange);
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
                item.parentNode.insertBefore(targetElement, item);
                this.changePosition(targetElement, item);
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
        this.durationMap.set(id,{duration: element.duration, startTime: 0.00, origDuration: element.duration})
        this.trackNode.dispatchEvent(TrackChange);
    } 

    /**
     * Changes the position of two elements on the track
     * @param {*} item1 
     * @param {*} item2 
     */
    changePosition(item1, item2) {
        let indexTarget = this.elements.findIndex(element => element.id === item1.id);
        let indexThis = this.elements.findIndex(element => element.id === item2.id);
        swap(this.elements, indexTarget, indexThis);
        swap(this.fileKeys, indexTarget, indexThis);
        
        this.trackNode.dispatchEvent(TrackChange);
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
        return this.getElementByIndex(this.currentElement + 1)
    }
/**
     * Returns previous Element in the Track if possible
     * @returns {object} object containing fileKey, startTime and duration
     */
    previous() {
        return this.getElementByIndex(this.currentElement - 1)
    }

    /**
     * Returns Element according to Index in the Track if possible
     * @param {int} Index of the Element
     * @returns {object} object containing fileKey, startTime and duration
     */
    getElementByIndex(index) {
        console.log(index);
        if (this.elements.length > index && index >= 0) {
            this.currentElement = index;
            const duration = this.durationMap.get(this.elements[index].id);
            return {
                fileKey: this.fileKeys[this.currentElement], 
                startTime: duration.startTime,
                duration: duration.duration
            }
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
            const duration = this.durationMap.get(this.elements[i].id);
            const endTime = startTime + duration.duration;
            if (time >= startTime && time <= endTime) {
                this.currentElement = i;                
                return {
                    fileKey: this.fileKeys[i], 
                    startTime: duration.startTime,
                    duration: duration.duration,
                    time: time - startTime + duration.startTime,
                }
            }
        }
        return null;
    }
}

let TrackChange = new Event("trackChange", {bubbles: true});

function swap(array, index1, index2) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

