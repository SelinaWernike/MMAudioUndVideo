export default class EditManager {

    constructor(trackname, sectionname, type) {
        this.sectionname = sectionname;
        this.trackname = trackname;
        this.type = type;
        this.trackNode = document.querySelector('#' + trackname);
        this.sectionNode = document.querySelector('#' + sectionname);
    }

    initializeTrack() {
        this.sectionNode.addEventListener("dragover", (ev) => {
            ev.preventDefault();
        })
        this.sectionNode.addEventListener('drop', (e) => {
            e.preventDefault();
            let container = document.createElement('div');
            container.classList.add('column');
            let childData = e.dataTransfer.getData('html');
            container.innerHTML = childData;
            let nameElement = container.querySelector(".fileNameText");
            let name = nameElement.innerHTML;
            console.log(name);
            console.log(childData);
            if(name.includes(this.type)) {
                this.trackNode.appendChild(container);

            }
        });
    }

}
