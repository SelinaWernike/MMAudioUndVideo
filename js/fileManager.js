export default class FileManager {

    constructor() {
        this.files = {}
    }

    openFile() {
        // var fs = require('fs');
    }

     addFile() {
        let input = document.querySelector('input');
        const fileList = input.files;
        if (!( fileList.length === 0)){
            for(const file of fileList){
                this.files[file.name] = file
                const listItem = document.createElement('li');
                listItem.setAttribute("draggable", true);
                listItem.addEventListener("dragstart", (e) => {
                    e.dataTransfer.setData("html", e.target.innerHTML)
                })
                const textDiv = document.createElement("div");
                const text = document.createTextNode(`${file.name}`);
                textDiv.appendChild(text);
                textDiv.className = 'fileNameText';

                const imgDiv = document.createElement("div");
                const image = document.createElement('img');
                image.src = this.getImageForFileType(file);
                image.width = 50;
                image.className = 'fileListImage';
                imgDiv.appendChild(image);

                const spanDiv = document.createElement("div");
                const span = document.createElement("SPAN");
                const spanText = document.createTextNode("X");
                span.className = "close";
                span.appendChild(spanText);
                span.onclick = function() {
                    document.getElementById("fileList").removeChild(listItem);
                };
                spanDiv.appendChild(span);
                listItem.appendChild(imgDiv);
                listItem.appendChild(textDiv);
                listItem.appendChild(spanDiv);

                document.getElementById("fileList").appendChild(listItem);
            }
        }
     }

    removeFile(listItem) {
        console.log("removeFile");
        document.getElementById("fileList").removeChild(listItem);
    }

    getImageForFileType(file){
        if(file.type.includes('audio/')){
            return '/../images/audio.png';
        }else if(file.type.includes('video/')){
            return '/../images/video.png';
        }
    }
}