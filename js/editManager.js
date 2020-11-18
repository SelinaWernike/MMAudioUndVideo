/**
 * @author Selina Wernike
 * This Class creates a Manager for File Tracks. It enabels the user 
 * to Drag files onto the tracks and change thier sequence in the final
 * Video. It also enables editing the Video, e.g. cutting
 */
export default class EditManager {

    
    constructor(trackname, sectionname, type, filterManager) {
        this.filterManager = filterManager;
        this.type = type;
        this.trackNode = document.querySelector('#' + trackname);
        this.sectionNode = document.querySelector('#' + sectionname);
        this.elements = [];
        this.fileKeys = [];
        this.id = 0;
    }

/**
 * Adds event listener for draging Input Files onto the tracks
 */
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
                this.id++;
                container.innerHTML = childData;
                this.elements.push(container)
                container.children[0].removeAttribute("draggable")
                const fileKey = container.children[0].getAttribute("fileKey")
                this.fileKeys.push(fileKey)
                let nameElement = container.querySelector(".fileNameText");
                let name = nameElement.innerHTML;
                // TODO: type (audio or video) should be checked against file.type
                if(name.includes(this.type)) {
                    var width = 99 / (this.elements.length + 1);
                    if(this.elements.length > 0 && width > 1) {
                        container.style.width = width + "%";
                        this.elements.forEach(col => {
                            col.style.width = width + "%";
                        });
                    }
                    container = this.addDragNDrop(container);
                    this.trackNode.appendChild(container);
                    this.addRemoveEvent();
                }
            }
        });
    }

    //TODO: only add listener for current element
    addRemoveEvent() {
        this.elements.forEach((item, index) => {
            let close = item.querySelector("span")
            close.addEventListener("click", () => {
                this.removeElement(item, index)
            })
        });
    }

    /**
    * removes an element from the track
    */
    removeElement(item, index) {
        item.parentNode.removeChild(item);
        this.elements.splice(index, 1)
        this.fileKeys.splice(index, 1)
    }

/**
 * Adds Drag and Drop to the Track elements
 * @param {Node} item Sets the Drag and Drop event for the Track Elements. This enabels
 * the Position change on the Track. 
 */
    addDragNDrop(item) {
        item.setAttribute("draggable", true);
        item.addEventListener("dragstart", (e) => {
            if(e.target.id) {
                let obj = {id: e.target.id, html: e.target.innerHTML};
                e.dataTransfer.setData("trackItem", JSON.stringify(obj));

            }
        }); 
        item.addEventListener("drop", (ev) => {
            if(ev.dataTransfer.getData("trackItem")) {
                let targetObj = JSON.parse(ev.dataTransfer.getData("trackItem"));
                console.log(targetObj);
                let targetElement = this.sectionNode.querySelector("#" + targetObj.id);
                targetElement.innerHTML = item.innerHTML;
                item.innerHTML = targetObj.html;
                this.elements = this.sectionNode.querySelectorAll(".column");
            }
        });
        return item;    
    }
/**
 * gets the Length of the start- and endTime HTML element according to all the Elements on the Track.
 */
    getTrackLength() {
       this.elements.forEach(element => {
           
       });
        
    }

    getFileKeys(){
        return this.fileKeys;
    }
}
