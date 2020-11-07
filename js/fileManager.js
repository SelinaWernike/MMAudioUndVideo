export default class FileManager {

    constructor(){
        this.fileMap = new Map(); //key: getfileKey(), value: ArrayBuffer with file data
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }

    /**
     * adds files of html <input> element both to frontend list and to backend map
     */
     addFile() {
        let input = document.querySelector('input');
        const fileList = input.files;
        if (!( fileList.length === 0)){
            for(const file of fileList){
                this.addToFileMap(file);
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
                span.onclick = () => {
                    document.getElementById("fileList").removeChild(listItem);
                    this.fileMap.delete(this.getFileKey(file));
                };
                spanDiv.appendChild(span);
                listItem.appendChild(imgDiv);
                listItem.appendChild(textDiv);
                listItem.appendChild(spanDiv);

                document.getElementById("fileList").appendChild(listItem);
            }
        }
     }

    /**
     *
     * @param file - element of html input element files list
     * @returns {string} - value for key of fileMap
     */
     getFileKey(file){
        return ''.concat(file.name, file.size, file.type, file.lastModified);
     }

    /**
     * adds specified file to file map, if not already added.
     * @param file
     */
    addToFileMap(file) {
        let fileKey = this.getFileKey(file);
        if(!this.fileMap.has(fileKey)){
            const reader = new FileReader();
            reader.onerror = (event) => {
                console.error("File could not be read! Code " + event.target.error.code);
            };
            reader.onloadend = (event) => {
                this.fileMap.set(fileKey, event.target.result);
            }
            reader.readAsArrayBuffer(file);
        }
    }

    /**
     *
     * @param file - element of html input element files list
     * @returns {string} - the right image icon according to file type
     */
    getImageForFileType(file){
        if(file.type.includes('audio/')){
            return '/../images/audio.png';
        }else if(file.type.includes('video/')){
            return '/../images/video.png';
        }
    }
}