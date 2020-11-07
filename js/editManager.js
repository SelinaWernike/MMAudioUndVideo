export default class EditManager {

    
    constructor(trackname, sectionname, type) {
        this.type = type;
        this.trackNode = document.querySelector('#' + trackname);
        this.sectionNode = document.querySelector('#' + sectionname);
        this.elements = [];
        this.id = 0;
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
                container.id = "item" + this.id;
                this.id++;
                container.innerHTML = childData;
                let nameElement = container.querySelector(".fileNameText");
                let name = nameElement.innerHTML;
                if(name.includes(this.type)) {
                    this.elements = this.sectionNode.querySelectorAll(".column");
                    var width = 99 / (this.elements.length + 1);
                    if(this.elements.length > 0 && width > 1) {
                        container.style.width = width + "%";
                        this.elements.forEach(col => {
                            col.style.width = width + "%";
                        });
                    }
                    container = this.addDragNDrop(container);
                    this.trackNode.appendChild(container);
                    this.elements = this.sectionNode.querySelectorAll(".column");
                    this.removeElement();
                   
                    
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

}
