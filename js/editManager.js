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

    constructor(trackname, loader, resizable, clickable) {
        this.trackNode = document.querySelector('#' + trackname);
        this.loader = loader;
        this.elements = [];
        this.fileKeys = [];
        this.durationMap = new FunctionMap();
        this.startMap = new FunctionMap();
        this.resizable = resizable;
        this.clickable = clickable;
        this.id = 0;
        this.currentElement = -1;
    }

    /**
     * Adds Dragover and Drop Eventlistener to the track. When deopped over the Track
     * the Element will be added to the Track.
     * @param {VideoController|AudioController} controller the controller that uses the element of the track
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
     * @param {HTMLElement} container The html-Element whisch is added as a Child of trackNode
     * @param {String} fileKey The fileKey used to load the File
     * @param {HTMLElement} trackObject The video, audio or effect element
     * @param {int} dropIndex the index on which the element is dropped
     */
    addElementData(container, fileKey, trackObject, dropIndex) {
        this.fileKeys.splice(dropIndex, 0, fileKey);
        this.elements.splice(dropIndex, 0, container);
        this.durationMap.set(container.id, { get duration() { return trackObject.duration }, startTime: 0.00, origDuration: trackObject.duration });
        if (this.resizable) {
            this.startMap.set(container.id, function () { return trackObject.start });
        } else {
            this.startMap.set(container.id, this.getGlobalStartTime.bind(this, container.id));
        }
    }
    /**
     * Returns the global start time of an elemnet on the track
     * @param {int} elementId 
     * @returns {int} Global time in seconds
     */
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
     * @param {HTMLElement} container The container to wich the events need to be added.
     */
    addElementEvents(container) {
        this.addDragNDrop(container);
        this.addOptionsEvent(container);
        this.addRemoveEvent(container);
        if (this.resizable) {
            this.addResizeEvents(container)
        }
        if (this.clickable) {
            this.addJumpEvent(container)
        }
    }

    /**
     * Calculates the index at which the element is inserted based on the drop x-position.
     * 
     * @param {DragEvent} event the event from dropping a element on the track
     * @returns {int} The index on which the element needs to be dropped
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
     * @param {HTMLElement} item The item to which the event is mapped
     */
    addRemoveEvent(item) {
        let close = item.querySelector(".close")
        if (!close) {
            close = document.createElement("span");
            close.textContent = "X"
            close.className = "pointer close"
            item.appendChild(close)
        }
        close.addEventListener("click", (event) => {
            this.removeElement(item)
            event.stopPropagation()
        })
    }
    /**
     * Adds the settings event to an track element
     * @param {HTMLElement} item The item to which the event is mapped
     */
    addOptionsEvent(item) {
        let options = item.querySelector(".options");
        if (!options && this.trackNode.id != "effecttrack") {
            let close = item.querySelector(".close");
            options = document.createElement("div");
            options.className = "pointer options"
            const image = document.createElement('img');
            image.src = '/../images/cut_white.png';
            image.width = 30;
            image.className = 'fileListImage';
            image.setAttribute("draggable", false);
            options.appendChild(image);
            item.children[0].replaceChild(options, close);
            item.children[0].appendChild(close);
        }

        if (options) {
            options.addEventListener("click", (event) => {
                SettingsManager.onSettingsClick(event, this.durationMap)
                event.stopPropagation()
            })
        }
    }

    /**
     * Removes an element from the track
     * @param {HTMLElement} item Item that needs to be removed
     */
    removeElement(item) {
        item.parentNode.removeChild(item);
        const index = this.elements.findIndex(element => element.id === item.id);
        this.elements.splice(index, 1);
        this.fileKeys.splice(index, 1);
        this.durationMap.delete(item.id);
        this.startMap.delete(item.id);
        this.resizeElements();
        if (SettingsManager.isSettingsOpen()) {
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
     * @param {HTMLElement} item Sets the Drag and Drop event for the Track Elements. This enabels
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
     * @param {HTMLElement} element  
     * @param {int} id 
     */
    setItemDuration(element, id) {
        this.durationMap.set(id, { duration: element.duration, startTime: 0.00, origDuration: element.duration })
        this.trackNode.dispatchEvent(TrackChange);
    }

    /**
     * Changes the position of two elements on the track
     * @param {HTMLElement} item1 
     * @param {HTMLElement} item2 
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

    addJumpEvent(element) {
        element.addEventListener("click", () => {
            const index = this.elements.findIndex(check => element.id === check.id)
            if (index !== this.currentElement) {
                const current = this.getElementByIndex(index)
                this.controller.changeSource(current).then(() => {
                    this.controller.video.dispatchEvent(new Event("seeked"))
                })
            }
        })
    }

    /**
     * Changes StartTime or Duration of an Element
     * @param {String} key 
     * @param {Object} timeObject Object containing startTime and duartion
     */
    changeTime(key, timeObject) {
        this.durationMap.set(key, timeObject);
        this.trackNode.dispatchEvent(TrackChange);
    }

    /**
     * Returns next Element in the Track if possible
     * @returns {Object} object containing fileKey, startTime and duration
     */
    next(highlight = true) {
        return this.getElementByIndex(this.currentElement + 1, highlight)
    }
    /**
     * Returns previous Element in the Track if possible
     * @returns {Object} object containing fileKey, startTime and duration
     */
    previous(highlight = true) {
        return this.getElementByIndex(this.currentElement - 1, highlight)
    }

    /**
     * Returns Element according to Index in the Track if possible
     * @param {int} Index of the Element
     * @returns {Object} object containing fileKey, startTime and duration
     */
    getElementByIndex(index, highlight = true) {
        if (this.elements.length > index && index >= 0) {
            this.currentElement = index;
            if (highlight) {
                this.highlight(this.currentElement)
            }
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
     * @param {Number} time in seconds
     * @returns {Object} object containing fileKey, startTime and duration
     */
    getElementByTime(time, highlight = true) {
        for (let i = 0; i < this.elements.length; i++) {
            const startTime = this.startMap.get(this.elements[i].id);
            const duration = this.durationMap.get(this.elements[i].id);
            const endTime = startTime + duration.duration;
            if (time >= startTime && time <= endTime) {
                this.currentElement = i;
                if (highlight) {
                    this.highlight(this.currentElement)
                }
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
    /**
     * Highlights an element
     * @param {int} index Index for the highlighted element
     */
    highlight(index) {
        const element = this.elements[index];
        if (this.elements.length > 1) {
            for (let i = 0; i < this.elements.length; i++) {
                if (i !== index) {
                    this.dehighlight(this.elements[i])
                }
            }
        }
        let pictures = element.querySelectorAll(".fileListImage");
        pictures.forEach(pic => {
            pic.style.webkitFilter = "brightness(0)";
        });
        element.style.backgroundColor = "#a0d840";
        element.style.color = "black"
    }
    /**
     * Dehighlights an element
     * @param {HTMLElement} element Index for the dehighlighted element
     */
    dehighlight(element) {
        let pictures = element.querySelectorAll(".fileListImage");
        pictures.forEach(pic => {
            pic.style.webkitFilter = "brightness(0.75)";
        });
        element.style.backgroundColor = "#555555";
        element.style.color = "#eaeaea"
    }
}

let TrackChange = new Event("trackChange", { bubbles: true });

function swap(array, index1, index2) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}
